using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public class Comment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = null!;
    
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("replyTo")]
    public string? ReplyTo { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("commentOn")]
    public string CommentOn { get; set; } = null!;

    [BsonElement("author")]
    public string Author { get; set; } = null!;

    [BsonElement("body")]
    public string Body { get; set; } = null!;
}