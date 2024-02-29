using clr_api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace clr_api.Services;

public class UsersService
{
    private readonly IMongoCollection<User> _usersCollection;

    private readonly ClassService _classService;

    public UsersService(
        IOptions<ClrApiDatabaseSettings> clrApiDatabaseSettings, ClassService classService)
    {
        var mongoClient = new MongoClient(
            clrApiDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            clrApiDatabaseSettings.Value.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            clrApiDatabaseSettings.Value.UsersCollectionName);

        _classService = classService;
    }

    public async Task<List<User>> GetAsync() =>
        await _usersCollection.Find(_ => true).ToListAsync();

    public async Task<User?> GetAsync(string id) =>
        await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<User?> GetByUsername(string username) =>
        await _usersCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

    public async Task CreateAsync(User newUser)
    {
        // Find default course
        // Eventually this will load users' enrolled courses
        var foundClass = await _classService.GetByCode("csc373");

        if (foundClass is null)
        {
            return;
        }

        // Assign default/enrolled courses to student
        UserCourse userCourse = new UserCourse(foundClass.Oid, foundClass.Code, UserRole.Student);
        newUser.Courses = new List<UserCourse>() { userCourse };
        await _usersCollection.InsertOneAsync(newUser);
    }

    public async Task UpdateAsync(string id, User updatedUser) =>
        await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

    public async Task EnrollUser(string userId, string classId, string code, UserRole role)
    {
        var foundUser = await this.GetAsync(userId);
        if (foundUser is null || foundUser.Courses.Exists(existing => existing.Oid == classId))
        {
            return;
        }

        var newClass = new UserCourse(classId, code, role);
        var filter = Builders<User>.Filter.Eq(user => user.Id, userId);
        var update = Builders<User>.Update.Push("Courses", newClass);
        await _usersCollection.UpdateOneAsync(filter, update);
    }

    public async Task RemoveAsync(string id) =>
        await _usersCollection.DeleteOneAsync(x => x.Id == id);

    public UserRole? RoleInClass(User user, string classId)
    {
        var foundClass = user.Courses.Find(x => x.Oid == classId);
        if (foundClass is null)
        {
            return null;
        }

        return foundClass.Role;
    }
}