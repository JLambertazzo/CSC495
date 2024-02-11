namespace clr_api.Models;

public class ClrApiDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string UsersCollectionName { get; set; } = null!;
    
    public string ClassCollectionName { get; set; } = null!;

    public string CLRSCollectionName { get; set; } = null!;

    public string ProblemCollectionName { get; set; } = null!;
}