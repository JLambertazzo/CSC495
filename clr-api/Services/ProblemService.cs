using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

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

    public async Task CreateAsync(Problem newProblem, string username, string offeringId)
    {
        newProblem.Author = username;
        newProblem.Version = 0;
        newProblem.Class = offeringId;
        await _problemCollection.InsertOneAsync(newProblem);
    }

    public async Task CreateFromClrsAsync(int chapter, int problem, string solution, string username, string offeringId)
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
            Status = ProblemStatus.Posted,
            Class = offeringId,
            Type = ProblemType.Clrs
        };
        await _problemCollection.InsertOneAsync(newProblem);
    }

    public async Task EditSolution(string problemId, string newSolution, string username)
    {
        var problem = await _problemCollection.Find(x => (x.Id == problemId || x.Source == problemId) && x.Latest).FirstOrDefaultAsync();
        if (problem is null || problem.Status == ProblemStatus.Endorsed)
        {
            return;
        }

        var source = problem.Source ?? problem.Id;

        var newProblem = new Problem
        {
            Source = source,
            Author = username,
            Solution = newSolution,
            Body = problem.Body,
            Status = problem.Status,
            Version = problem.Version + 1,
            Title = problem.Title,
            Class = problem.Class,
            Latest = true,
            Type = problem.Type
        };
        await _problemCollection.InsertOneAsync(newProblem);
        
        // mark found problem as not latest
        var filter = Builders<Problem>.Filter.Eq(x => x.Id, problem.Id);
        var update = Builders<Problem>.Update.Set(x => x.Latest, false);
        await _problemCollection.UpdateOneAsync(filter, update);
    }

    public async Task SetStatus(string problemId, ProblemStatus status)
    {
        var filter = Builders<Problem>.Filter.Eq(x => x.Id, problemId);
        var update = Builders<Problem>.Update.Set(x => x.Status, status);
        await _problemCollection.FindOneAndUpdateAsync(filter, update);
    }

    public async Task<List<Problem>> GetByClassAsync(string offeringId, ProblemStatus? status) =>
        await _problemCollection.Find(x => x.Class == offeringId && x.Latest && (!status.HasValue || (x.Status == status))).ToListAsync();

    public async Task<Problem?> GetAsync(string problemId) =>
        await _problemCollection.Find(x => (x.Id == problemId || x.Source == problemId) && x.Latest).FirstOrDefaultAsync();

    public async Task<List<Problem>> GetBySourceAsync(string source) =>
        await _problemCollection.Find(x => x.Source == source || x.Id == source).ToListAsync();

}