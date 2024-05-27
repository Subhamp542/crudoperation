var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder
            .WithOrigins("http://127.0.0.1:5500")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowLocalhost");

// Log response headers (for debugging purposes)
app.Use(async (context, next) =>
{
    await next();
    var headers = context.Response.Headers;
    foreach (var header in headers)
    {
        Console.WriteLine($"{header.Key}: {header.Value}");
    }
});

app.UseAuthorization();

app.MapControllers();

app.Run();
