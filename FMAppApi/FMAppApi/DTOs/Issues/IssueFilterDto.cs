public class IssueFilterDto
{
    public string? Status { get; set; }
    public string? Department { get; set; }  // ✅ Add this
    public string? Priority { get; set; }
}
