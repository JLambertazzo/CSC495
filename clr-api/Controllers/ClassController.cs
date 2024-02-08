using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassController : ControllerBase
{
    private readonly ClassService _classService;

    public ClassController(ClassService classService) => 
        _classService = classService;

    [HttpGet]
    public async Task<List<Class>> Get() =>
        await _classService.GetAsync();

    [HttpGet("find")]
    public async Task<ActionResult<Class>> Get(string? id, string? code)
    {
        Class? foundClass = null;
        if (id is not null)
        {
            foundClass = await _classService.GetAsync(id);
        }
        else if (code is not null)
        {
            foundClass = await _classService.GetByCode(code);
        }

        if (foundClass is null)
        {
            return NotFound();
        }

        return foundClass;
    }
    
    [HttpPost]
    public async Task<ActionResult<Class>> Post(Class newClass)
    {
        // TODO: add some uniqueness check by term
        await _classService.CreateAsync(newClass);
        return CreatedAtAction(nameof(Get), new { id = newClass.Oid }, newClass);
    }

    [HttpPatch]
    public async Task<IActionResult> Patch(Class updatedClass)
    {
        await _classService.UpdateAsync(updatedClass.Oid, updatedClass);
        return NoContent();
    }
    
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var foundClass = await _classService.GetAsync(id);

        if (foundClass is null)
        {
            return NotFound();
        }

        await _classService.RemoveAsync(id);

        return NoContent();
    }
}