using ClrApi.Models;
using ClrApi.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ClrApiDatabaseSettings>(
    builder.Configuration.GetSection("ClrApiDatabase"));

builder.Services.AddSingleton<UsersService>();

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

// app.UseHttpsRedirection();

app.Run();
