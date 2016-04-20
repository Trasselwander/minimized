using System;
using System.Security.Cryptography;
using Server.Services;
using static Server.Services.UserService;

namespace Server.Services
{
    class CryptoService
    {
        public static bool IsCorrectPassword(string password, User user)
        {
            var salt = Convert.FromBase64String(user.salt);
            var v = new Rfc2898DeriveBytes(password, salt, 3987);
            return Convert.ToBase64String(v.GetBytes(25), Base64FormattingOptions.None) == user.hash;
        }

        public static void HashAndSavePassword(string password, User user)
        {
            var v = new Rfc2898DeriveBytes(password, 16, 3987);
            user.hash = Convert.ToBase64String(v.GetBytes(25), Base64FormattingOptions.None);
            user.salt = Convert.ToBase64String(v.Salt, Base64FormattingOptions.None);
        }
    }
}
