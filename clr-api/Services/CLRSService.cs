using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace clr_api.Services;

public class CLRSService
{
    private readonly IMongoCollection<CLRS> _clrsCollection;
    
    public CLRSService(
        IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _clrsCollection = mongoDatabase.GetCollection<CLRS>(
            clrApiDatabaseSettings.Value.CLRSCollectionName);
    }

    public async Task<CLRS?> GetAsync(int chapter, int problem) =>
        await _clrsCollection.Find(x => x.Chapter == chapter && x.Problem == problem).FirstOrDefaultAsync();

    public async Task CreateAsync(CLRS newClrsProblem)
    {
        var chapterFilter = Builders<CLRS>.Filter.Eq("chapter", newClrsProblem.Chapter);
        var problemFilter = Builders<CLRS>.Filter.Eq("problem", newClrsProblem.Problem);
        var filter = Builders<CLRS>.Filter.And(chapterFilter, problemFilter);
        var existing = await _clrsCollection.Find(filter).FirstOrDefaultAsync();
        if (existing is not null)
        {
            return;
        }

        await _clrsCollection.InsertOneAsync(newClrsProblem);
    }
    
    public async Task UpdateAsync(string id, CLRS updatedClrs) =>
        await _clrsCollection.ReplaceOneAsync(x => x.Id == id, updatedClrs);
    
    public async Task RemoveAsync(string id) =>
        await _clrsCollection.DeleteOneAsync(x => x.Id == id);
}