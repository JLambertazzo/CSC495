using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace clr_api.Services;

public class PullRequestService
{
    private readonly IMongoCollection<PullRequest> _pullRequestCollection;
    private readonly ProblemService _problemService;

    public PullRequestService(IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings, ProblemService problemService)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _pullRequestCollection = mongoDatabase.GetCollection<PullRequest>(
            clrApiDatabaseSettings.Value.PullRequestCollectionName);

        _problemService = problemService;
    }

    public async Task<List<PullRequest>> GetAsync() =>
        await _pullRequestCollection.Find(_ => true).ToListAsync();
    
    public async Task<PullRequest?> GetAsync(string id) =>
        await _pullRequestCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
    
    public async Task<List<PullRequest>> GetByProblemAsync(string id) =>
        await _pullRequestCollection.Find(x => x.ProblemId == id).ToListAsync();
    
    public async Task CreateAsync(PullRequest newPullRequest) =>
        await _pullRequestCollection.InsertOneAsync(newPullRequest);

    
    public async Task UpdateAsync(string id, PullRequest updatedPullRequest) =>
        await _pullRequestCollection.ReplaceOneAsync(x => x.Id == id, updatedPullRequest);
    
    public async Task RemoveAsync(string id) =>
        await _pullRequestCollection.DeleteOneAsync(x => x.Id == id);

    public async Task UpvoteAsync(string id, PullRequest pullRequest)
    {
        var updatedPullRequest = new PullRequest
        {
            Body = pullRequest.Body,
            Id = pullRequest.Id,
            ProblemId = pullRequest.ProblemId,
            Author = pullRequest.Author,
            Upvotes = pullRequest.Upvotes + 1
        };
        await _pullRequestCollection.ReplaceOneAsync(x => x.Id == id, updatedPullRequest);
    }

    public async Task MergeAsync(PullRequest pullRequest)
    {
        // Update Problem with the PR's solution
        await _problemService.EditSolution(pullRequest.ProblemId, pullRequest.Body, pullRequest.Author);
        
        // Delete the PR
        await RemoveAsync(pullRequest.Id);
    }

    public async Task UpdateBodyAsync(PullRequest pullRequest, string newBody)
    {
        var updatedPullRequest = new PullRequest
        {
            Body = newBody,
            Author = pullRequest.Author,
            Id = pullRequest.Id,
            ProblemId = pullRequest.ProblemId,
            // We rest upvotes when the author updates the solution
            Upvotes = 0
        };
        await UpdateAsync(pullRequest.Id, updatedPullRequest);
    }
}
    