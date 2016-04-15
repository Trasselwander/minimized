using Nancy;

namespace Server.Modules
{
    class RegisterModule : HelperModule
    {
        public RegisterModule()
            : base("api/login")
        {
            Get["/"] = parameters =>
            {
                return CreateResponse(HttpStatusCode.Forbidden);
            };
        }
    }
}
