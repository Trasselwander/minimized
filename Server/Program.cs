using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Mono.Data.Sqlite;
using Nancy.Hosting.Self;
using Nancy;
using Nancy.TinyIoc;
using Nancy.Bootstrapper;
using Server.Modules;
using Nancy.Conventions;

namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var host = new NancyHost(new Uri("http://localhost:1234"), new CustomBootstraper()))
            {
                host.Start();
                Console.WriteLine("Running on http://localhost:1234");
                Console.ReadLine();
            }
        }
    }

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
    public class IndexModule : HelperModule
    {
        public IndexModule() : base("")
        {
            Get[@"/"] = parameters =>
            {
                return Response.AsFile(@"../Client/index.html", "text/html");
            };
        }
    }

    public class CustomBootstraper : DefaultNancyBootstrapper
    {
        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
        {
            pipelines.OnError.AddItemToEndOfPipeline((ctx, exception) => { return null; });
        }

        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);

            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddFile("/", @"../Client/index.html"));
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddFile("/index", @"../Client/index.html"));
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddFile("/login", @"../Client/login.html"));
        }
    }
}
