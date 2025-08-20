using Dapper;
using FMAppApi.Dtos.Issues;
using FMAppApi.Entities;
using FMAppApi.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System.Data;

namespace FMAppApi.Repository.DbLayer
{
    public class IssueRepository : IIssueRepository
    {
        private readonly IDbConnection _db;
        private readonly IWebHostEnvironment _env;

        public IssueRepository(IDbConnection db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // Employee creates issue
        public async Task<Issue> CreateIssueAsync(CreateIssueDto dto, int userId)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            var images = new List<IssueImage>();

            if (dto.Images != null && dto.Images.Any())
            {
                // ✅ Safer way to build path
                string uploadsFolder = Path.Combine(_env.WebRootPath, "Uploads", "Issues");
                Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.Images)
                {
                    // Unique + safe filename
                    string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    string filePath = Path.Combine(uploadsFolder, fileName);

                    // Save file to disk
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    images.Add(new IssueImage
                    {
                        FilePath = $"/Uploads/Issues/{fileName}",   // ✅ URL-friendly path
                        UploadedAt = DateTime.UtcNow
                    });
                }
            }

            // Insert issue and return Id
            var sql = @"
        INSERT INTO Issues (Title, Description, Department, Priority, CreatedById, Status, CreatedAt) 
        VALUES (@Title, @Description, @Department, @Priority, @CreatedById, @Status, @CreatedAt);
        SELECT CAST(SCOPE_IDENTITY() as int);";

            var issueId = await _db.ExecuteScalarAsync<int>(sql, new
            {
                dto.Title,
                dto.Description,
                dto.Department,
                dto.Priority,
                CreatedById = userId,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
              
            });

            // Insert history
            await _db.ExecuteAsync(
                "INSERT INTO IssueHistory (IssueId, Action, PerformedAt) VALUES (@IssueId, @Action, @PerformedAt)",
                new {  IssueId = issueId, Action = "Issue created", PerformedAt = DateTime.UtcNow }
            );

            // Insert images in DB
            foreach (var img in images)
            {
                await _db.ExecuteAsync(
                    "INSERT INTO IssueImage (IssueId, FilePath, UploadedAt) VALUES (@IssueId, @FilePath, @UploadedAt)",
                    new { IssueId = issueId, img.FilePath, img.UploadedAt }
                );
            }

            return new Issue
            {
                Issue_Id = issueId,
                Title = dto.Title,
                Description = dto.Description,
                Department = dto.Department,
                Priority = dto.Priority,
                CreatedById = userId,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                Images = images
            };
        }


        // Supervisor assigns issue
        public async Task AssignIssueAsync(AssignIssueDto dto)
        {
            var sql = "UPDATE Issues SET AssignedToId = @EmployeeId, Status = 'Assigned' WHERE Issue_Id = @IssueId";
            await _db.ExecuteAsync(sql, new { dto.IssueId, dto.EmployeeId });

            await _db.ExecuteAsync(
                "INSERT INTO IssueHistories (Issue_Id, Action, PerformedAt) VALUES (@IssueId, @Action, @PerformedAt)",
                new { IssueId = dto.IssueId, Action = $"Assigned to Employee {dto.EmployeeId}", PerformedAt = DateTime.UtcNow }
            );
        }

        // Employee resolves issue
        public async Task ResolveIssueAsync(ResolveIssueDto dto, int userId)
        {
            // Save resolution images
            var images = new List<IssueImage>();
            if (dto.ResolutionImages != null && dto.ResolutionImages.Any())
            {
                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "issues");
                Directory.CreateDirectory(uploadsFolder);

                foreach (var file in dto.ResolutionImages)
                {
                    string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    string filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    images.Add(new IssueImage
                    {
                        FilePath = $"/uploads/issues/{fileName}",
                        UploadedAt = DateTime.UtcNow
                    });
                }
            }

            // Update issue status
            await _db.ExecuteAsync("UPDATE Issues SET Status = 'Resolved' WHERE Issue_Id = @IssueId", new { dto.IssueId });

            // Insert images into DB
            foreach (var img in images)
            {
                await _db.ExecuteAsync(
                    "INSERT INTO IssueImages (Issue_Id, FilePath, UploadedAt) VALUES (@IssueId, @FilePath, @UploadedAt)",
                    new { IssueId = dto.IssueId, img.FilePath, img.UploadedAt }
                );
            }

            // Insert history
            await _db.ExecuteAsync(
                "INSERT INTO IssueHistories (Issue_Id, Action, PerformedAt) VALUES (@IssueId, @Action, @PerformedAt)",
                new { IssueId = dto.IssueId, Action = $"Resolved by Employee {userId}: {dto.ResolutionDescription}", PerformedAt = DateTime.UtcNow }
            );
        }

        // Supervisor approves issue
        public async Task ApproveIssueAsync(ApproveIssueDto dto)
        {
            await _db.ExecuteAsync("UPDATE Issues SET Status = 'Approved' WHERE Issue_Id = @IssueId", new { dto.IssueId });

            await _db.ExecuteAsync(
                "INSERT INTO IssueHistories (Issue_Id, Action, PerformedAt) VALUES (@IssueId, @Action, @PerformedAt)",
                new { IssueId = dto.IssueId, Action = $"Approved by Supervisor {dto.ApprovedById}", PerformedAt = DateTime.UtcNow }
            );
        }

        // Get issues with optional filters
        public async Task<IEnumerable<Issue>> GetIssuesAsync(IssueFilterDto filter)
        {
            var sql = "SELECT * FROM Issues WHERE 1=1";
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(filter.Status))
            {
                sql += " AND Status = @Status";
                parameters.Add("Status", filter.Status);
            }

            if (!string.IsNullOrEmpty(filter.Department))
            {
                sql += " AND Department = @Department";
                parameters.Add("Department", filter.Department);
            }

            if (!string.IsNullOrEmpty(filter.Priority))
            {
                sql += " AND Priority = @Priority";
                parameters.Add("Priority", filter.Priority);
            }

            return await _db.QueryAsync<Issue>(sql, parameters);
        }
    }
}
