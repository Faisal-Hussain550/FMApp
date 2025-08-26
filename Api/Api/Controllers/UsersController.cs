using FMAppApi.Entities;
using FMAppApi.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FMAppApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = (await _userRepository.GetAllUsersAsync()).FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            var id = await _userRepository.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = id }, user);
        }
   
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userRepository.DeleteUserAsync(id);
            if (!success) return NotFound("User not found or could not be deleted.");
            return Ok(new { message = "User deleted successfully" });
        }
    }

}
