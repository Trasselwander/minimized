using Nancy;
using Server.Services;

namespace Server.Modules
{
    public class RegisterModule : HelperModule
    {
        public RegisterModule()
            : base("api/register")
        {
            Get["/"] = parameters =>
            {
                UserService.User auth = GetNameAndPasswordFromAuth();
                Users.CreateUser(auth.name, auth.hash);

                UserService.User u = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK);
            };
        }
    }
}
