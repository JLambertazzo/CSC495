using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public class PullRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("problemId")]
    public string? ProblemId { get; set; }

    [BsonElement("upvotes")] public int Upvotes { get; set; } = 0;
    
    [BsonElement("body")]
    public string Body { get; set; }
    
    [BsonElement("author")]
    public string Author { get; set; }
    
}