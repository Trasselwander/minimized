using Nancy;
using Server.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Modules
{
    public class HelperModule : NancyModule
    {
        public HelperModule() { }
        public HelperModule(string path) : base(path) { }

        public UserService Users = new UserService();

        public UserService.User GetNameAndPasswordFromAuth()
        {
            if (this.Request.Headers.Authorization == null || !this.Request.Headers.Authorization.Contains(' '))
                throw new HttpErrorException(HttpStatusCode.Unauthorized, "Missing login info.");

            string[] cred = Encoding.UTF8.GetString(Convert.FromBase64String(this.Request.Headers.Authorization.Split(' ')[1])).Split(':');
            if (cred.Length != 2) throw new HttpErrorException(HttpStatusCode.Unauthorized, "Missing login info.");
            return new UserService.User() { name = cred[0], hash = cred[1] };
        }

        public UserService.User AuthorizeUser()
        {
            UserService.User auth = GetNameAndPasswordFromAuth();
            UserService.User u = Users.GetUser(auth.name);

            if (u == null) throw new HttpErrorException(HttpStatusCode.Unauthorized, "Missing login info.");

            if (CryptoService.IsCorrectPassword(auth.hash, u))
                return u;
            else
                throw new HttpErrorException(HttpStatusCode.BadRequest, "Wrong password.");
        }

        public static Response CreateResponse(HttpStatusCode status, string message)
        {
            byte[] b = Encoding.UTF8.GetBytes(message ?? "Error");
            Response r = new Response() { StatusCode = status };
            r.Contents = s => { try { s.Write(b, 0, b.Length); } catch (Exception) { } };

            return r;
        }

        public static Response CreateResponse(HttpStatusCode status)
        {
            return new Response() { StatusCode = status };
        }
    }
}
