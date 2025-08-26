using Dapper;
using FMAppApi.Dtos.Common;
using FMAppApi.Dtos.Issues;
using FMAppApi.Entities;
using Microsoft.AspNetCore.Http;
using System.Data;

public class IssueRepository : IIssueRepository
{
    private readonly IDbConnection _db;

    public IssueRepository(IDbConnection db)
    {
        _db = db;
    }

    // Create Issue and upload images
    public async Task<Issue> CreateIssueAsync(CreateIssueDto dto, int userId)
    {
        if (_db.State == ConnectionState.Closed)
            _db.Open(); // ✅ Make sure connection is open

        // Insert Issue
        var sql = @"
            INSERT INTO Issues
    (Title, Description, Status, CreateDate, CreateBy,Department, AssignedDeptManger, Priority, AssignDeptEmp, AsgnDeptEmpDate)
OUTPUT INSERTED.*
VALUES
    (@Title, @Description, 'Open', @CreateDate, @CreateBy, @Department, @AssignedDeptManger, @Priority, @AssignDeptEmp, @AsgnDeptEmpDate);
";

        var issue = await _db.QuerySingleAsync<Issue>(sql, new
        {
            Title = dto.Title,
            Description = dto.Description,
            CreateBy = userId,
            Department = dto.Department,
            Priority = dto.Priority,
            AssignDeptEmp = dto.AssignedToId,
            CreateDate = DateTime.UtcNow,
            AssignedDeptManger = dto.AssignedDeptManger, // ✅ now saving from DTO
            AsgnDeptEmpDate = dto.AssignedToId.HasValue ? DateTime.UtcNow : (DateTime?)null // ✅ set date only if assigned
        });

        // Upload images if any
        if (dto.Images != null && dto.Images.Any())
        {
            await UploadIssueImagesAsync(issue.Issue_Id, dto.Images);
        }

        return issue;
    }

    // Upload multiple images for an issue
    public async Task UploadIssueImagesAsync(int issueId, List<IFormFile> files)
    {
        if (_db.State == ConnectionState.Closed)
            _db.Open(); // ✅ Ensure connection is open

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "Issues");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file to server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Insert record into IssueImage table
            var sql = @"INSERT INTO IssueImage (FilePath, UploadedAt, IssueId)
                        VALUES (@FilePath, @UploadedAt, @IssueId)";

            var rows = await _db.ExecuteAsync(sql, new
            {
                FilePath = $"/Uploads/Issues/{uniqueFileName}",
                UploadedAt = DateTime.UtcNow,
                IssueId = issueId
            });

            if (rows == 0)
                throw new Exception("Failed to insert image record into IssueImage table");
        }
    }

    // Remaining repository methods...
    public async Task AssignIssueAsync(AssignIssueDto dto)
    {
        var sql = "UPDATE Issues SET AssignDeptEmp = @EmployeeId, AsgnDeptEmpDate = @AssignDate WHERE Issue_Id = @IssueId";
        var rows = await _db.ExecuteAsync(sql, new { EmployeeId = dto.EmployeeId, IssueId = dto.IssueId, AssignDate = DateTime.UtcNow });

        if (rows == 0) throw new Exception("Issue not found");
    }

    public async Task ResolveIssueAsync(ResolveIssueDto dto, int userId)
    {
        var sql = "UPDATE Issues SET Status = 'Resolved' WHERE Issue_Id = @IssueId";
        var rows = await _db.ExecuteAsync(sql, new { dto.IssueId });
        if (rows == 0) throw new Exception("Issue not found");
    }

    public async Task ApproveIssueAsync(ApproveIssueDto dto)
    {
        var sql = "UPDATE Issues SET Status = 'Approved' WHERE Issue_Id = @IssueId";
        var rows = await _db.ExecuteAsync(sql, new { dto.IssueId });
        if (rows == 0) throw new Exception("Issue not found");
    }

    public async Task<PagedResult<Issue>> GetIssuesAsync(IssueFilterDto filter)
    {
        var baseSql = "SELECT * FROM Issues WHERE 1=1";
        var countSql = "SELECT COUNT(*) FROM Issues WHERE 1=1";

        var parameters = new DynamicParameters();

        if (!string.IsNullOrEmpty(filter.Status))
        {
            baseSql += " AND Status = @Status";
            countSql += " AND Status = @Status";
            parameters.Add("Status", filter.Status);
        }

        if (!string.IsNullOrEmpty(filter.Department))
        {
            baseSql += " AND Department = @Department";
            countSql += " AND Department = @Department";
            parameters.Add("Department", filter.Department);
        }

        if (!string.IsNullOrEmpty(filter.Priority))
        {
            baseSql += " AND Priority = @Priority";
            countSql += " AND Priority = @Priority";
            parameters.Add("Priority", filter.Priority);
        }


        if (filter.AssignedToId.HasValue)
        {
            baseSql += " AND AssignDeptEmp = @AssignedToId";
            countSql += " AND AssignDeptEmp = @AssignedToId";
            parameters.Add("AssignedToId", filter.AssignedToId);
        }
        var totalCount = await _db.ExecuteScalarAsync<int>(countSql, parameters);

        baseSql += " ORDER BY Issue_Id OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
        parameters.Add("Skip", (filter.Page - 1) * filter.PageSize);
        parameters.Add("Take", filter.PageSize);

        var items = await _db.QueryAsync<Issue>(baseSql, parameters);

        return new PagedResult<Issue>
        {
            Items = items.ToList(),
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize),
            PageNumber = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<List<Issue>> GetAllIssuesAsync()
    {
        var sql = @"
        SELECT i.*, ii.IssueImage_Id, ii.FilePath
        FROM Issues i
        LEFT JOIN IssueImage ii ON i.Issue_Id = ii.IssueId";

        var issueDict = new Dictionary<int, Issue>();

        var result = await _db.QueryAsync<Issue, IssueImage, Issue>(
            sql,
            (issue, image) =>
            {
                if (!issueDict.TryGetValue(issue.Issue_Id, out var currentIssue))
                {
                    currentIssue = issue;
                    currentIssue.Images = new List<IssueImage>();
                    issueDict.Add(currentIssue.Issue_Id, currentIssue);
                }

                if (image != null)
                {
                    currentIssue.Images.Add(image);
                }

                return currentIssue;
            },
            splitOn: "IssueImage_Id"
        );

        return issueDict.Values.ToList();
    }



    public async Task<List<Issue>> GetIssuesByManagerAsync(int managerId)
    {
        var sql = @"
        SELECT i.*, ii.IssueImage_Id, ii.FilePath
        FROM Issues i
        LEFT JOIN IssueImage ii ON i.Issue_Id = ii.IssueId
        WHERE i.AssignedDeptManger = @ManagerId";

        var issueDict = new Dictionary<int, Issue>();

        var result = await _db.QueryAsync<Issue, IssueImage, Issue>(
            sql,
            (issue, image) =>
            {
                if (!issueDict.TryGetValue(issue.Issue_Id, out var currentIssue))
                {
                    currentIssue = issue;
                    currentIssue.Images = new List<IssueImage>();
                    issueDict.Add(currentIssue.Issue_Id, currentIssue);
                }

                if (image != null)
                {
                    currentIssue.Images.Add(image);
                }

                return currentIssue;
            },
            new { ManagerId = managerId },
            splitOn: "IssueImage_Id"
        );

        return issueDict.Values.ToList();
    }
}
