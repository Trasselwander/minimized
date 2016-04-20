using System;
using Nancy.Hosting.Self;

namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var host = new NancyHost(new Uri("http://localhost:1234"), new CustomBootstraper()))
            {
                Console.WriteLine("Creating database...");
                SQLite.InitDatabase();

                host.Start();
                Console.WriteLine("Running nancy on http://localhost:1234");
                Console.ReadLine();
            }
        }
    }
}
