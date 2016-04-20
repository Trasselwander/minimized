using Nancy;
using Server.Services;
using System;
using System.Text;

namespace Server.Modules
{
    public class RegisterModule : HelperModule
    {
        public RegisterModule()
            : base("api/register")
        {
            Get["/{email}"] = parameters =>
            {
                UTF8Encoding.UTF8.GetString(Convert.FromBase64String(parameters.email));

                UserService.User auth = GetNameAndPasswordFromAuth();
                auth.email = parameters.email != null ? Encoding.UTF8.GetString(Convert.FromBase64String(parameters.email)) : null;
                Users.CreateUser(auth.name, auth.hash, auth.email);

                UserService.User u = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK);
            };
        }
    }
}
