using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public class Class
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Oid { get; set; }

    [BsonElement("code")]
    public string Code { get; set; } = null!;
}