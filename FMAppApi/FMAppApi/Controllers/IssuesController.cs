using FMAppApi.Dtos.Issues;
using FMAppApi.Entities;
using FMAppApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class IssuesController : ControllerBase
{
    private readonly IIssueRepository _issueRepo;


    public IssuesController(IIssueRepository issueRepo)
    {
        _issueRepo = issueRepo;
       
        
    }

    // Employee creates issue
    [HttpPost("create")]
    [Authorize(Roles = "Employee,Admin")]
    public async Task<IActionResult> CreateIssue([FromForm] CreateIssueDto dto)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("User ID not found in token.");

        var userId = int.Parse(userIdClaim);

        var issue = await _issueRepo.CreateIssueAsync(dto, userId);
        return Ok(new { message = "Issue created ✅", issueId = issue.Issue_Id });
    }

    // Supervisor assigns issue to employee
    [HttpPost("assign")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> AssignIssue([FromBody] AssignIssueDto dto)
    {
        await _issueRepo.AssignIssueAsync(dto);
        return Ok(new { message = "Issue assigned to employee 🚀" });
    }

    // Employee resolves issue
    [HttpPost("resolve")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> ResolveIssue([FromForm] ResolveIssueDto dto)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("User ID not found in token.");

        var userId = int.Parse(userIdClaim);

        await _issueRepo.ResolveIssueAsync(dto, userId);
        return Ok(new { message = "Issue marked as resolved 🛠️" });
    }

    // Supervisor approves issue resolution
    [HttpPost("approve")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> ApproveIssue([FromBody] ApproveIssueDto dto)
    {
        await _issueRepo.ApproveIssueAsync(dto);
        return Ok(new { message = "Issue approved ✅" });
    }

    // Admin & Manager & Supervisor can view issues
    [HttpGet("all")]
    [Authorize(Roles = "Admin,Manager,Supervisor")]
    public async Task<IActionResult> GetAllIssues(
        [FromQuery] string? status,
        [FromQuery] string? department,
        [FromQuery] string? priority,
        [FromQuery] int? assignedToId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 10;

        var filter = new IssueFilterDto
        {
            Status = status,
            Department = department,
            Priority = priority,
            AssignedToId = assignedToId,
            Page = page,
            PageSize = pageSize
        };

        // ✅ call repo
        var issues = await _issueRepo.GetIssuesAsync(filter);

        // ✅ return result using 'issues'
        return Ok(new
        {
            currentPage = issues.PageNumber,
            pageSize = issues.PageSize,
            totalCount = issues.TotalCount,
            totalPages = issues.TotalPages,
            data = issues.Items
        });
    }
    [HttpPost("{issueId}/upload-image")]
    public async Task<IActionResult> UploadIssueImages(int issueId, List<IFormFile> files)
    {
        await _issueRepo.UploadIssueImagesAsync(issueId, files);
        return Ok(new { message = "Images uploaded successfully ✅" });
    }

}
