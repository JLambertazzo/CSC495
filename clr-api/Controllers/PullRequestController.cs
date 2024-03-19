using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PullRequestController(PullRequestService pullRequestService, UsersService usersService, ProblemService problemService) : ControllerBase
{
    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<PullRequest>> Get(string id)
    {
        var pullRequest = await pullRequestService.GetAsync(id);
        return pullRequest == null ? NotFound() : pullRequest;
    }

    [HttpGet("problem/{problemUuid}")]
    public async Task<ActionResult<List<PullRequest>>> GetByProblem(string problemUuid) =>
        await pullRequestService.GetByProblemAsync(problemUuid);
    
    [HttpPost]
    public async Task<ActionResult<PullRequest>> Post(PullRequest newPullRequest)
    {
        var created = await pullRequestService.CreateAsync(newPullRequest);
        if (created)
        {
            return CreatedAtAction(nameof(Get), new { id = newPullRequest.Id }, newPullRequest);
        }

        return Ok();
    }
    
    [HttpPost("upvote")]
    public async Task<ActionResult<PullRequest>> Upvote(string id, string username)
    {
        var pullRequest = await pullRequestService.GetAsync(id);
        if (pullRequest == null)
        {
            return NotFound();
        }
        await pullRequestService.UpvoteAsync(username, pullRequest);
        return Ok();
    }

    [HttpPost("merge")]
    public async Task<ActionResult<PullRequest>> Merge(string id)
    {
        var pullRequest = await pullRequestService.GetAsync(id);
        if (pullRequest == null)
        {
            return NotFound();
        }

        await pullRequestService.MergeAsync(pullRequest);
        return Ok();
    }
    
    [HttpPatch]
    public async Task<IActionResult> Patch(string id, string body)
    {
        var pullRequest = await pullRequestService.GetAsync(id);
        if (pullRequest == null)
        {
            return NotFound();
        }

        await pullRequestService.UpdateBodyAsync(pullRequest, body);
        return Ok();
    }
}