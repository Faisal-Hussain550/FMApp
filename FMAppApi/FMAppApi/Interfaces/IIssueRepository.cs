using FMAppApi.Dtos.Common;
using FMAppApi.Dtos.Issues;
using FMAppApi.Entities;
using Microsoft.AspNetCore.Http;
using System.Data;

public interface IIssueRepository
{
    Task<Issue> CreateIssueAsync(CreateIssueDto dto, int userId);
    Task AssignIssueAsync(AssignIssueDto dto);
    Task ResolveIssueAsync(ResolveIssueDto dto, int userId);
    Task ApproveIssueAsync(ApproveIssueDto dto);
    Task<PagedResult<Issue>> GetIssuesAsync(IssueFilterDto filter);
    Task UploadIssueImagesAsync(int issueId, List<IFormFile> files);
    Task<List<Issue>> GetAllIssuesAsync();

}
