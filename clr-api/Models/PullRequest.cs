using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public class PullRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("problemId")]
    public string ProblemUuid { get; set; }

    [BsonElement("upvoters")]
    public List<string> Upvoters { get; set; } = new();
    
    [BsonElement("body")]
    public string Body { get; set; }
    
    [BsonElement("author")]
    public string Author { get; set; }
    
}