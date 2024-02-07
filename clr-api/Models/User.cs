using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace clr_api.Models;

public enum UserRole
{
    Student,
    Instructor
}

public class UserCourse
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Oid { get; set; }
    
    [BsonElement("code")]
    public string? Code { get; set; }
    
    [BsonElement("role")]
    public UserRole Role { get; set; }
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