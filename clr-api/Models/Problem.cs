using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using shortid;
using shortid.Configuration;

namespace clr_api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProblemStatus
{
    [EnumMember(Value="Review")]
    Review,
    [EnumMember(Value="Posted")]
    Posted,
    [EnumMember(Value="Endorsed")]
    Endorsed
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProblemType
{
    [EnumMember(Value="CLRS")]
    Clrs,
    [EnumMember(Value="Tutorial")]
    Tutorial,
    [EnumMember(Value="Lecture")]
    Lecture,
    [EnumMember(Value="Other")]
    Other
}

public class Problem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("uuid")] 
    public string Uuid { get; init; } = ShortId.Generate(new GenerationOptions(useSpecialCharacters: false, useNumbers: true));

    [BsonElement("status")]
    public ProblemStatus Status { get; set; } = ProblemStatus.Review;

    [BsonElement("title")]
    public string Title { get; set; } = null!;

    [BsonElement("body")]
    public string Body { get; set; } = null!;

    [BsonElement("solution")]
    public string Solution { get; set; } = null!;

    [BsonElement("author")]
    public string Author { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("class")]
    public string Class { get; set; } = null!;

    [BsonElement("type")] public ProblemType? Type { get; set; } = null!;

    [BsonElement("version")]
    public int Version { get; set; } = 0;

    [BsonElement("latest")]
    public bool Latest { get; set; } = true;

    [BsonElement("AiReview")] public Ai? AiReview { get; set; }

}