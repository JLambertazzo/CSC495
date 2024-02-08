using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace clr_api.Services;

public class ClassService
{
    private readonly IMongoCollection<Class> _classesCollection;

    public ClassService(
        IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _classesCollection = mongoDatabase.GetCollection<Class>(
            clrApiDatabaseSettings.Value.ClassCollectionName);
    }
    
    public async Task<List<Class>> GetAsync() =>
        await _classesCollection.Find(_ => true).ToListAsync();

    public async Task<Class?> GetAsync(string id) =>
        await _classesCollection.Find(x => x.Oid == id).FirstOrDefaultAsync();
    
    public async Task<Class?> GetByCode(string code) =>
        await _classesCollection.Find(x => x.Code == code).FirstOrDefaultAsync();

    public async Task CreateAsync(Class newClass) =>
        await _classesCollection.InsertOneAsync(newClass);

    public async Task UpdateAsync(string id, Class updatedClass) =>
        await _classesCollection.ReplaceOneAsync(x => x.Oid == id, updatedClass);

    public async Task RemoveAsync(string id) =>
        await _classesCollection.DeleteOneAsync(x => x.Oid == id);
}