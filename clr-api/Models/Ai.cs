using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public class Ai
{
    [BsonElement("AiScore")] 
    public int? AiScore { get; set; }
    
    [BsonElement("AiReason")] 
    public string? AiReason { get; set; }
}