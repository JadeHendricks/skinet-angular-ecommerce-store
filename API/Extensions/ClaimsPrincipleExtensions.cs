using System.Security.Authentication;
using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    // claimsPrincipal is the base class for all claims-based identities
    // and is used to represent the current user in ASP.NET Core
    // and is used to access the claims associated with the user

    // UserManager<AppUser> is a class that provides methods for managing users
    // and is used to access the user store and perform operations on users
    public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var userToReturn = await userManager.Users.FirstOrDefaultAsync(x => x.Email == user.GetEmail())
            ?? throw new AuthenticationException("User not found");
            
        return userToReturn;
    }

        public static async Task<AppUser> GetUserByEmailWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var userToReturn = await userManager.Users
            .Include(x => x.Address)
            .FirstOrDefaultAsync(x => x.Email == user.GetEmail())
            ?? throw new AuthenticationException("User not found");
            
        return userToReturn;
    }

    public static string GetEmail(this ClaimsPrincipal user)
    {
        var email = user.FindFirstValue(ClaimTypes.Email)
            ?? throw new AuthenticationException("Email claim not found");

        return email;
    }
}