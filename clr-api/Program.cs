using clr_api.Models;
using clr_api.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ClrApiDatabaseSettings>(
    builder.Configuration.GetSection("ClrApiDatabase"));


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
        });
});

builder.Services.AddSingleton<UsersService>();
builder.Services.AddSingleton<ClassService>();
builder.Services.AddSingleton<CLRSService>();
builder.Services.AddSingleton<ProblemService>();
builder.Services.AddSingleton<PullRequestService>();
builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.MapControllers();

app.UseCors();

app.Run();
