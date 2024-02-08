using System.Text.Json.Serialization;
using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;
using ThirdParty.Json.LitJson;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrolmentController(ClassService classService, UsersService usersService) : ControllerBase
{
    public class EnrolmentBody(string userId, string classId, UserRole role)
    {
        [JsonProperty]
        public string UserId { get; } = userId;

        [JsonProperty]
        public string ClassId { get; } = classId;

        [JsonProperty]
        public UserRole Role { get; } = role;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] EnrolmentBody body)
    {
        var foundClass = await classService.GetAsync(body.ClassId);
        if (foundClass is null)
        {
            return NotFound();
        }

        await usersService.EnrollUser(body.UserId, body.ClassId, foundClass.Code, body.Role);
        return NoContent();
    }
}