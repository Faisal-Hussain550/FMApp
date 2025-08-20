using FMAppApi.Entities;

namespace FMAppApi.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByCredentialsAsync(string username, string password);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<int> AddUserAsync(User user);
    }
}
