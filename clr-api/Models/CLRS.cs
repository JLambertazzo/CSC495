using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public class CLRS
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("chapter")]
    public int Chapter { get; set; }
    
    [BsonElement("problem")]
    public int Problem { get; set; }
    
    [BsonElement("body")]
    public string Body { get; set; }
}