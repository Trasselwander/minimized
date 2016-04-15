namespace Server.Modules
{
    public class LoginModule : HelperModule
    {
        public LoginModule()
            : base("api/login")
        {
            Get["/"] = parameters =>
            {
                return true;
            };
        }
    }
}
