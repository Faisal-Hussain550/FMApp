using FMAppApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace FMAppApi.Repository.DbLayer
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Issue> Issues { get; set; }
        public DbSet<IssueImage> IssueImages { get; set; }
        public DbSet<IssueHistory> IssueHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map to your exact table names
            modelBuilder.Entity<Issue>().ToTable("Issue").HasKey(i => i.Issue_Id);
            modelBuilder.Entity<IssueHistory>().ToTable("IssueHistory").HasKey(h => h.IssueHistory_Id);
            modelBuilder.Entity<IssueImage>().ToTable("IssueImage").HasKey(img => img.IssueImage_Id);

            // Relationships
            modelBuilder.Entity<IssueHistory>()
                .HasOne(h => h.Issue)
                .WithMany(i => i.Histories)
                .HasForeignKey(h => h.Issue_Id);

            modelBuilder.Entity<IssueImage>()
                .HasOne(img => img.Issue)
                .WithMany(i => i.Images)
                .HasForeignKey(img => img.IssueId);

            // Ignore Users table (already exists)
            modelBuilder.Entity<User>().ToTable("Users").HasNoKey();
        }
    }
}
