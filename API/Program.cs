using API.Middleware;
using Core.Interface;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IProductRepository, ProductRepository>();
// if you want to use the generic repository pattern and don't know the type of the entity (generic type)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddCors();

var app = builder.Build(); 
app.UseMiddleware<ExceptionMiddleware>();
// this will allow any header and any method from the specified origin
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.MapControllers();

try 
{
    // creates a scope that can be used to resolve services
    // and dispose of them when the scope is disposed
    using var scope = app.Services.CreateScope();
    // get the service provider from the scope
    // and resolve the StoreContext from the service provider
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    throw;
}
app.Run();
