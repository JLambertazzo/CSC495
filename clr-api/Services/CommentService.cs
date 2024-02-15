using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace clr_api.Services;

public class CommentService
{
    private readonly IMongoCollection<Comment> _commentCollection;

    public CommentService(
        IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _commentCollection = mongoDatabase.GetCollection<Comment>(
            clrApiDatabaseSettings.Value.CommentCollectionName);
    }

    public async Task<List<Comment>> GetCommentsOnAsync(string id) =>
        await _commentCollection.Find(x => x.CommentOn == id).ToListAsync();

    public async Task CreateAsync(Comment newComment) =>
        await _commentCollection.InsertOneAsync(newComment);
    
    public async Task UpdateAsync(string id, string newBody) {
        var filter = Builders<Comment>.Filter.Eq(x => x.Id, id);
        var update = Builders<Comment>.Update.Set(x => x.Body, newBody);
        await _commentCollection.FindOneAndUpdateAsync(filter, update);
    }

    public async Task RemoveAsync(string id) =>
        await _commentCollection.DeleteOneAsync(x => x.Id == id);
}