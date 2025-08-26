using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

public class CreateIssueDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Department { get; set; }
    public string? Priority { get; set; }
    public int? AssignedToId { get; set; }
    public int? AssignedDeptManger { get; set; }
    // Support multiple file uploads
    public required List<IFormFile> Images { get; set; }
}
