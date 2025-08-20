using FMAppApi.Dtos.Issues;
using FMAppApi.Entities;

public interface IIssueRepository
{
    Task<Issue> CreateIssueAsync(CreateIssueDto dto, int userId);
    Task AssignIssueAsync(AssignIssueDto dto);
    Task ResolveIssueAsync(ResolveIssueDto dto, int userId);
    Task ApproveIssueAsync(ApproveIssueDto dto);
    Task<IEnumerable<Issue>> GetIssuesAsync(IssueFilterDto filter);
}
