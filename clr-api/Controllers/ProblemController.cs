using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;
using ThirdParty.Json.LitJson;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProblemController(ProblemService problemService, UsersService usersService, ClassService classService)
    : ControllerBase
{

    public class ProblemFromScratch(Problem problem, string userId, string offeringId)
    {
        [JsonProperty] public Problem Problem { get; set; } = problem;
        [JsonProperty] public string UserId { get; set; } = userId;
        [JsonProperty] public string OfferingId { get; set; } = offeringId;
    }

    public class ProblemFromClrs(int chapter, int problem, string solution, string userId, string offeringId)
    {
        [JsonProperty] public int Chapter { get; set; } = chapter;
        [JsonProperty] public int Problem { get; set; } = problem;
        [JsonProperty] public string Solution { get; set; } = solution;
        [JsonProperty] public string UserId { get; set; } = userId;
        [JsonProperty] public string OfferingId { get; set; } = offeringId;
    }

    public class ProblemUpdate(string newSolution, string userId)
    {
        [JsonProperty] public string NewSolution { get; set; } = newSolution;
        [JsonProperty] public string UserId { get; set; } = userId;
    }
        
    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Problem>> Get(string id)
    {
        var problem = await problemService.GetAsync(id);
        if (problem is null)
        {
            return NotFound();
        }
    
        return problem;
    }

    [HttpGet("history/{id:length(24)}")]
    public async Task<ActionResult<List<Problem>>> GetEditHistory(string id)
    {
        var problem = await problemService.GetAsync(id);
        if (problem is null)
        {
            return NotFound();
        }
        return await problemService.GetBySourceAsync(problem.Source ?? id);
    }
        

    [HttpGet("class/{id:length(24)}")]
    public async Task<ActionResult<List<Problem>>> GetByClass(string id, ProblemStatus? status) => 
        await problemService.GetByClassAsync(id, status);

    [HttpPost]
    public async Task<ActionResult<Problem>> Post([FromBody] ProblemFromScratch problemFromScratch)
    {
        var user = await usersService.GetAsync(problemFromScratch.UserId);
        var offering = await classService.GetAsync(problemFromScratch.OfferingId);
        if (user is null || offering is null)
        {
            return NotFound();
        }

        await problemService.CreateAsync(problemFromScratch.Problem, problemFromScratch.UserId,
            problemFromScratch.OfferingId);
        return CreatedAtAction(nameof(Get), new { id = problemFromScratch.Problem.Id }, problemFromScratch.Problem);
    }

    [HttpPost("clrs")]
    public async Task<ActionResult<Problem>> Post([FromBody] ProblemFromClrs problemFromClrs)
    {
        var user = await usersService.GetAsync(problemFromClrs.UserId);
        var offering = await classService.GetAsync(problemFromClrs.OfferingId);
        if (user is null || offering is null)
        {
            return NotFound();
        }

        await problemService.CreateFromClrsAsync(problemFromClrs.Chapter, problemFromClrs.Problem,
            problemFromClrs.Solution, problemFromClrs.UserId, problemFromClrs.OfferingId);
        return Ok();
    }

    [HttpPatch("status/{id:length(24)}/{status}")]
    public async Task<IActionResult> Patch(string id, ProblemStatus status)
    {
        await problemService.SetStatus(id, status);
        return Ok();
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Patch(string id, [FromBody] ProblemUpdate update)
    {
        var user = await usersService.GetAsync(update.UserId);
        if (user is null)
        {
            return NotFound();
        }

        await problemService.EditSolution(id, update.NewSolution, update.UserId);
        return Ok();
    }
}