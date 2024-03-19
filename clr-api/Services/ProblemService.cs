using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using shortid;
using shortid.Configuration;

namespace clr_api.Services;

public class ProblemService
{
    private readonly IMongoCollection<Problem> _problemCollection;
    private readonly CLRSService _clrsService;
    
    public ProblemService(
        IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings, CLRSService clrsService)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _problemCollection = mongoDatabase.GetCollection<Problem>(
            clrApiDatabaseSettings.Value.ProblemCollectionName);

        _clrsService = clrsService;
    }

    private String GetShortId()
    {
        var options = new GenerationOptions(useSpecialCharacters: false, useNumbers: true);
        return ShortId.Generate(options);
    }

    public async Task CreateAsync(Problem newProblem, string username, string offeringId)
    {
        newProblem.Author = username;
        newProblem.Version = 0;
        newProblem.Class = offeringId;
        await _problemCollection.InsertOneAsync(newProblem);
    }

    public async Task CreateFromClrsAsync(int chapter, int problem, string solution, string username, string offeringId, Ai aiReview)
    {
        var clrs = await _clrsService.GetAsync(chapter, problem);
        if (clrs is null)
        {
            return;
        }
        var newProblem = new Problem
        {
            Title = $"CLRS Chapter {chapter} Problem {problem}.",
            Body = clrs.Body,
            Author = username,
            Solution = solution,
            Version = 0,
            Status = ProblemStatus.Review,
            Class = offeringId,
            Type = ProblemType.Clrs,
            AiReview = aiReview
        };
        await _problemCollection.InsertOneAsync(newProblem);
    }

    public async Task EditSolution(string problemUuid, string newSolution, string username)
    {
        var problem = await _problemCollection.Find(x => x.Uuid == problemUuid && x.Latest).FirstOrDefaultAsync();
        if (problem is null)
        {
            return;
        }

        var newProblem = new Problem
        {
            Author = username,
            Solution = newSolution,
            Body = problem.Body,
            Status = problem.Status,
            Version = problem.Version + 1,
            Title = problem.Title,
            Class = problem.Class,
            Latest = true,
            Type = problem.Type,
            Uuid = problem.Uuid
        };
        await _problemCollection.InsertOneAsync(newProblem);
        
        // mark found problem as not latest
        var filter = Builders<Problem>.Filter.Eq(x => x.Id, problem.Id);
        var update = Builders<Problem>.Update.Set(x => x.Latest, false);
        await _problemCollection.UpdateOneAsync(filter, update);
    }

    public async Task SetStatus(string uuid, ProblemStatus status)
    {
        var update = Builders<Problem>.Update.Set(x => x.Status, status);
        await _problemCollection.FindOneAndUpdateAsync(x => x.Latest && x.Uuid == uuid, update);
    }

    public async Task<List<Problem>> GetByClassAsync(string offeringId, ProblemStatus? status) =>
        await _problemCollection.Find(x => x.Class == offeringId && x.Latest && (!status.HasValue || (x.Status == status))).ToListAsync();

    public async Task<Problem?> GetAsync(string uuid) =>
        await _problemCollection.Find(x => x.Uuid == uuid && x.Latest).FirstOrDefaultAsync();

    public async Task<List<Problem>?> GetByUuid(string uuid)
    {
        var versions = await _problemCollection.Find(x => x.Uuid == uuid).ToListAsync();
        if (versions is not null)
        {
            versions.Sort((x,y) => x.Version - y.Version);
        }
        return versions;
    }

    public async Task RemoveAsync(string uuid) =>
        await _problemCollection.DeleteManyAsync(x => x.Uuid == uuid);

    public async Task<Problem?> GetLatest(string uuid) =>
        await _problemCollection.Find(x => x.Uuid == uuid && x.Latest).FirstOrDefaultAsync();

    public async Task<List<String>?> GetAuthors(string uuid)
    {
        var allVersions = await GetByUuid(uuid);
        return allVersions.Select(x => x.Author).Distinct().ToList();
    }

}