using Microsoft.EntityFrameworkCore;
using MCV_Capstone.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace MCV_Capstone.Data
{

    public class luiz_trialContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public luiz_trialContext(DbContextOptions<luiz_trialContext> options) : base(options) { }
    }
}