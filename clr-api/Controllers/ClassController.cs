using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassController(ClassService classService) : ControllerBase
{
    [HttpGet]
    public async Task<List<Class>> Get() =>
        await classService.GetAsync();

    [HttpGet("find")]
    public async Task<ActionResult<Class>> Get(string? id, string? code)
    {
        Class? foundClass = null;
        if (id is not null)
        {
            foundClass = await classService.GetAsync(id);
        }
        else if (code is not null)
        {
            foundClass = await classService.GetByCode(code);
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
        await classService.CreateAsync(newClass);
        return CreatedAtAction(nameof(Get), new { id = newClass.Oid }, newClass);
    }

    [HttpPatch]
    public async Task<IActionResult> Patch(Class updatedClass)
    {
        await classService.UpdateAsync(updatedClass.Oid, updatedClass);
        return NoContent();
    }
    
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var foundClass = await classService.GetAsync(id);

        if (foundClass is null)
        {
            return NotFound();
        }

        await classService.RemoveAsync(id);

        return NoContent();
    }
}