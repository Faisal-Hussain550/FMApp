//using Microsoft.EntityFrameworkCore;
//using FMAppApi.Entities;
//using System;

//namespace FMAppApi.Data
//{
//    public class ApplicationDbContext : DbContext
//    {
//        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

//        public DbSet<User> Users { get; set; }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            base.OnModelCreating(modelBuilder);

//            // Seed Users with explicit IDs
//            modelBuilder.Entity<User>().HasData(
//                new User
//                {
//                    Id = -1,
//                    Username = "admin",
//                    Password = "1234", // TODO: Hash before production
//                    Role = "Admin",
//                    LastLogin = null,
                   
//                },
//                new User
//                {
//                    Id = -2,
//                    Username = "supervisor",
//                    Password = "1234",
//                    Role = "Supervisor",
//                    LastLogin = null,
//                    IpAddress = "0.0.0.0"
//                },
//                new User
//                {
//                    Id = -3,
//                    Username = "employee",
//                    Password = "1234",
//                    Role = "Employee",
//                    LastLogin = null,
//                    IpAddress = "0.0.0.0"
//                },
//                new User
//                {
//                    Id = -4,
//                    Username = "manager",
//                    Password = "1234",
//                    Role = "Manager",
//                    LastLogin = null,
//                    IpAddress = "0.0.0.0"
//                }
//            );
//        }
//    }
//}
