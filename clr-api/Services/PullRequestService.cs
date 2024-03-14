using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace clr_api.Services;

public class PullRequestService
{
    private readonly IMongoCollection<PullRequest> _pullRequestCollection;
    private readonly ProblemService _problemService;
    private readonly UsersService _usersService;

    public PullRequestService(IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings, ProblemService problemService, UsersService usersService)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _pullRequestCollection = mongoDatabase.GetCollection<PullRequest>(
            clrApiDatabaseSettings.Value.PullRequestCollectionName);

        _problemService = problemService;
        _usersService = usersService;
    }

    public async Task<List<PullRequest>> GetAsync() =>
        await _pullRequestCollection.Find(_ => true).ToListAsync();
    
    public async Task<PullRequest?> GetAsync(string id) =>
        await _pullRequestCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
    
    public async Task<List<PullRequest>> GetByProblemAsync(string id) =>
        await _pullRequestCollection.Find(x => x.ProblemId == id).ToListAsync();

    /**
     * Create a pull request if user is a student, make the edit immediately if instructor
     * Returns True if pull request was made, false otherwise
     */
    public async Task<Boolean> CreateAsync(PullRequest newPullRequest)
    {
        var author = await _usersService.GetByUsername(newPullRequest.Author);
        var problem = await _problemService.GetLatest(newPullRequest.ProblemId ?? "");
        if (author is not null && problem is not null &&
            _usersService.RoleInClass(author, problem.Class) == UserRole.Instructor)
        {
            var result = await _problemService.EditSolution(problem.Id ?? "", newPullRequest.Body, newPullRequest.Author);
            if (result is not null)
            {
                await MoveToNewProblem(problem.Id ?? "", result);
            }
            return false;
        }
        await _pullRequestCollection.InsertOneAsync(newPullRequest);
        return true;
    }

    
    public async Task UpdateAsync(string id, PullRequest updatedPullRequest) =>
        await _pullRequestCollection.ReplaceOneAsync(x => x.Id == id, updatedPullRequest);
    
    public async Task RemoveAsync(string id) =>
        await _pullRequestCollection.DeleteOneAsync(x => x.Id == id);

    public async Task UpvoteAsync(string username, PullRequest pullRequest)
    {
        if (pullRequest.Author == username)
        {
            return;
        }
        var updatedPullRequest = new PullRequest
        {
            Body = pullRequest.Body,
            Id = pullRequest.Id,
            ProblemId = pullRequest.ProblemId,
            Author = pullRequest.Author,
            Upvoters = pullRequest.Upvoters
        };
        if (pullRequest.Upvoters.Exists(x => x == username))
        {
            // User upvoted already, they're removing their vote
            updatedPullRequest.Upvoters.Remove(username);
        }
        else
        {
            updatedPullRequest.Upvoters.Add(username);
        }
        await _pullRequestCollection.ReplaceOneAsync(x => x.Id == pullRequest.Id, updatedPullRequest);
    }

    public async Task MoveToNewProblem(string oldProblemId, string newProblemId)
    {
        var filter = Builders<PullRequest>.Filter.Eq(x => x.ProblemId, oldProblemId);
        var updateProblemId = Builders<PullRequest>.Update.Set(x => x.ProblemId, newProblemId);
        var updateUpvoters = Builders<PullRequest>.Update.Set(x => x.Upvoters, new());
        var update = Builders<PullRequest>.Update.Combine(updateProblemId, updateUpvoters);
            
        await _pullRequestCollection.UpdateManyAsync(filter, update);
    }

    public async Task MergeAsync(PullRequest pullRequest)
    {
        // Update Problem with the PR's solution
        var result = await _problemService.EditSolution(pullRequest.ProblemId, pullRequest.Body, pullRequest.Author);

        if (result is not null)
        {
            await MoveToNewProblem(pullRequest.ProblemId, result);
        }
        
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
            // We reset upvoters when the author updates the solution
            Upvoters = new()
        };
        await UpdateAsync(pullRequest.Id, updatedPullRequest);
    }
}
    