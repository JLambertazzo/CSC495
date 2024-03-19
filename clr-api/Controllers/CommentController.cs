using System.Runtime.InteropServices;
using clr_api.Models;
using clr_api.Services;
using Microsoft.AspNetCore.Mvc;
using ThirdParty.Json.LitJson;

namespace clr_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController(CommentService commentService, UsersService usersService) : ControllerBase
{
    public class CommentUpdateData
    {
        [JsonProperty]
        public string id { get; set; }
        [JsonProperty]
        public string newBody { get; set; }
    }
    
    [HttpGet("{uuid}")]
    public async Task<List<Comment>> Get(string uuid) =>
        await commentService.GetCommentsOnAsync(uuid);
    
    [HttpGet("{id:length(24)}/replies")]
    public async Task<List<Comment>> GetReplies(string id) =>
        await commentService.GetRepliesOnAsync(id);

    [HttpPost]
    public async Task<IActionResult> Post(Comment newComment)
    {
        var user = await usersService.GetByUsername(newComment.Author);
        if (user is null)
        {
            return NotFound();
        }
        await commentService.CreateAsync(newComment);
        
        if (newComment.ReplyTo != null)
        {
            await commentService.UpdateReplies(newComment.ReplyTo);
        }
        return Ok();
    }

    [HttpPatch]
    public async Task Patch([FromBody] CommentUpdateData commentUpdateData) =>
        await commentService.UpdateAsync(commentUpdateData.id, commentUpdateData.newBody);

    [HttpDelete("{id:length(24)}")]
    public async Task Delete(string id) 
    {
        var comment = await commentService.GetByIdAsync(id);
        if (comment != null && comment.ReplyTo != null)
        {
            await commentService.DeleteReply(comment.ReplyTo);
        }
        await commentService.RemoveAsync(id);
    }
}