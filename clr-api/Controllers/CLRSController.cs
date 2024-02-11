using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CLRSController(CLRSService clrsService) : ControllerBase
{
    [HttpGet("{chapter}/{problem}")]
    public async Task<CLRS> Get(int chapter, int problem) =>
        await clrsService.GetAsync(chapter, problem);

    [HttpPost]
    public async Task Post([FromBody] CLRS newClrsProblem) =>
        await clrsService.CreateAsync(newClrsProblem);

    [HttpPatch]
    public async Task Patch([FromBody] CLRS newClrsProblem) =>
        await clrsService.UpdateAsync(newClrsProblem.Id, newClrsProblem);

    [HttpDelete("{chapter}/{problem}")]
    public async Task<IActionResult> Delete(int chapter, int problem)
    {
        var foundClrs = await clrsService.GetAsync(chapter, problem);
        if (foundClrs is null)
        {
            return NotFound();
        }

        await clrsService.RemoveAsync(foundClrs.Id);
        return Ok();
    }
}