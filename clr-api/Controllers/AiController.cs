using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController(AiService aiService): ControllerBase
{
      
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] string body)
    {
        var result = await aiService.GetAiReview(body);
        return Ok(result);
    }
    
}