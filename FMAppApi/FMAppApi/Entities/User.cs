namespace FMAppApi.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "employee";
        public DateTime? LastLogin { get; set; }
        public string? LastIp { get; set; }
        public string? IpAddress { get; internal set; }
    }
}
