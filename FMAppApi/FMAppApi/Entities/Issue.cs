public class Issue
{
    public int Issue_Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Open";
    public DateTime? CreateDate { get; set; } = DateTime.UtcNow;
    public int CreateBy { get; set; }
    public int AssignToDept { get; set; }
    public int? AssignedDeptManger { get; set; }
    public string Priority { get; set; } = "Medium";
    public int? AssignDeptEmp { get; set; }
    public DateTime? AsgnDeptEmpDate { get; set; }

    // Navigation
    public ICollection<IssueHistory>? Histories { get; set; }
    public ICollection<IssueImage>? Images { get; set; }
}
