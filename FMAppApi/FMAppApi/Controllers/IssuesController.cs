using FMAppApi.Entities;
using FMAppApi.Dtos.Issues;
using FMAppApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    [Authorize(Roles = "Employee")]
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

    // Admin & Manager can view issues
    [HttpGet("all")]
    [Authorize(Roles = "Admin,Manager,Supervisor")]
    public async Task<IActionResult> GetAllIssues([FromQuery] IssueFilterDto filter)
    {
        var issues = await _issueRepo.GetIssuesAsync(filter);
        return Ok(issues);
    }
}
