using FMAppApi.Entities;

public class IssueImage
{
    public int IssueImage_Id { get; set; }
    public string? FilePath { get; set; }
    public DateTime UploadedAt { get; set; }
    public int IssueId { get; set; }

    // Navigation
    public Issue? Issue { get; set; }
}