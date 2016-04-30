using Nancy;

namespace Server.Modules
{
    public class LoginModule : HelperModule
    {
        public LoginModule()
            : base("api/login")
        {
            Get["/"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                Users.UpdateLastLoggedIn(user);
                return CreateResponse(HttpStatusCode.OK);
            };
        }
    }
}
