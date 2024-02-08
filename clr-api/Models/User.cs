using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ThirdParty.Json.LitJson;

namespace clr_api.Models;

public static class UserRole
{
    public const string Student = "student";
    public const string Instructor = "instructor";
}

public class UserCourse(string oid, string code, string role)
{
    [JsonProperty]
    public string Oid { get; set; } = oid;

    [JsonProperty]
    public string Code { get; set; } = code;

    [JsonProperty]
    public string Role { get; set; } = role;
}

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("username")]
    public string Username { get; set; } = null!;

    [BsonElement("password")]
    public string Password { get; set; } = null!;

    [BsonElement("courses")]
    public List<UserCourse> Courses { get; set; } = new List<UserCourse>();
}