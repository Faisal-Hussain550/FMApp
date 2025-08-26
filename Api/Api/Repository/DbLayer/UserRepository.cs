using Dapper;
using System.Data;
using FMAppApi.Entities;
using FMAppApi.Interfaces;

namespace FMAppApi.Repository.DbLayer
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection _db;

        public UserRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<User?> GetUserByCredentialsAsync(string username, string password)
        {
            var sql = "SELECT * FROM Users WHERE Username = @Username AND Password = @Password";
            return await _db.QueryFirstOrDefaultAsync<User>(sql, new { Username = username, Password = password });
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var sql = "SELECT * FROM Users";
            return await _db.QueryAsync<User>(sql);
        }

        public async Task<int> AddUserAsync(User user)
        {
            var sql = @"INSERT INTO Users (Username, Password, Role, LastLogin, LastIp,Department)
                        VALUES (@Username, @Password, @Role, @LastLogin, @LastIp,@Department)";
            return await _db.ExecuteAsync(sql, user);
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                var sql = "DELETE FROM Users WHERE Id = @Id";
                var affectedRows = await _db.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
            catch
            {
                return false;
            }
        }

    }
}
