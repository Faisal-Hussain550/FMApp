
using FMAppApi.Entities;

public class IssueHistory
{
    public int IssueHistory_Id { get; set; }
    public int Issue_Id { get; set; }
    public string? Action { get; set; }
    public DateTime PerformedAt { get; set; }

    // Navigation
    public Issue? Issue { get; set; }
}