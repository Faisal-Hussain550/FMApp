using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace FMAppApi.Dtos.Issues
{
    public class ResolveIssueDto
    {
        public int IssueId { get; set; }
        public string? ResolutionDescription { get; set; }
        public required List<IFormFile> ResolutionImages { get; set; }  // post-resolution images
    }
}
