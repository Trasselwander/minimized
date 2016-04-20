using Nancy;
using Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Modules
{
    public class HelperModule : NancyModule
    {
        public HelperModule(string path) : base(path) { }
        public HelperModule() { }

        public UserService Users = new UserService();





        public UserService.User AuthorizeUser()
        {
            if (this.Request.Headers.Authorization == null)
                throw new HttpErrorException(HttpStatusCode.Unauthorized, "Missing login info.");

            string[] cred = UTF8Encoding.UTF8.GetString(Convert.FromBase64String(this.Request.Headers.Authorization.Split(' ')[1])).Split(':');


            UserService.User u = Users.GetUser(cred[0]);

            int hash = hashCode(u.hash + this.Request.Url.Path.Substring(1, this.Request.Url.Path.Length - 1));
            if (hash + "" == cred[1])
                return u;
            else
                throw new HttpErrorException(HttpStatusCode.BadRequest, "Wrong password.");
        }
        public static Response CreateResponse(HttpStatusCode status, string message)
        {
            byte[] b = UTF8Encoding.UTF8.GetBytes(message ?? "Error");
            Response r = new Response() { StatusCode = status };
            r.Contents = s => { try { s.Write(b, 0, b.Length); } catch (Exception) { } };


            return r;
        }

        public static int hashCode(string s)
        {
            int h = 0;
            for (int i = 0; i < s.Length; i++)
                h = 31 * h + s[i];

            return h;
        }

        public static Response CreateResponse(HttpStatusCode status)
        {
            return new Response() { StatusCode = status };
        }
    }
}
