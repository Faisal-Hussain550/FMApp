public class IssueFilterDto
{
    public string? Status { get; set; }
    public string? Department { get; set; }
    public string? Priority { get; set; }
    public int? AssignedToId { get; set; }

    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
