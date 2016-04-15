using Nancy;

namespace Server.Modules
{
    public class IndexModule : HelperModule
    {
        public IndexModule() : base("")
        {
            Get["/"] = parameters =>
            {
                return Response.AsFile("content/index.html", "text/html");
            };
        }
    }
}
