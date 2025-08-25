public class Issue
{
    public int Issue_Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Open";
    public string City { get; set; } = string.Empty; // ✅ No longer nullable
    public int CreatedById { get; set; }
    public string Department { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public int? AssignedToId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<IssueHistory>? Histories { get; set; }
    public ICollection<IssueImage>? Images { get; set; }
}
