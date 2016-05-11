using System;
using Nancy.Hosting.Self;
using Server.Modules;

namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var host = new NancyHost(new Uri("http://localhost:1235"), new CustomBootstraper()))
            {
                Console.WriteLine("Creating database...");
                SQLite.InitDatabase();

                host.Start();
                Console.WriteLine("Running nancy on http://localhost:1235");

                Console.WriteLine("Starting timers..");
                TimerModule.initTimers();

                Console.WriteLine("Press any key to stop the server..");
                Console.ReadLine();
            }
        }
    }
}
