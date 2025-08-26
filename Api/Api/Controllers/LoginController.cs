using Microsoft.AspNetCore.Mvc;
using FMAppApi.Entities;
using Dapper;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FMAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IDbConnection _db;
        private readonly IConfiguration _config;

        public LoginController(IDbConnection db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Username) || string.IsNullOrEmpty(loginDto.Password))
                return BadRequest("Username and Password are required.");

            var sql = "SELECT TOP 1 * FROM Users WHERE Username = @Username AND Password = @Password";
            var user = await _db.QueryFirstOrDefaultAsync<User>(sql, new { loginDto.Username, loginDto.Password });

            if (user == null)
                return Unauthorized("Invalid credentials");

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            user.LastIp = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _db.ExecuteAsync(
                "UPDATE Users SET LastLogin = @LastLogin, LastIp = @LastIp WHERE Id = @Id",
                new { user.LastLogin, user.LastIp, user.Id }
            );

            // ✅ Generate JWT Token
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful",
                token = token,
                role = user.Role
            });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("username", user.Username),
                new Claim("role", user.Role ?? "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Token expires in 1 hour
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
