using System;
using Nancy.Hosting.Self;
using Server.Modules;

namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            long[] times = new long[] { 5 * 60 * 1000, 30 * 60 * 1000, 6 * 60 * 60 * 1000 }; // 5min, 30min, 6h
            bool[] skipfirst = new bool[] { true, true, false }; // 5min, 30min, 6h

            using (var host = new NancyHost(new Uri("http://localhost:1235"), new CustomBootstraper()))
            {
                Console.WriteLine("Creating database...");
                SQLite.InitDatabase();

                host.Start();
                Console.WriteLine("Running nancy on http://localhost:1235");

                Console.WriteLine("Starting timers..");
                for (int i = 0; i < times.Length; i++)
                {
                    Services.TimerService t = new Services.TimerService(times[i], skipfirst[i]);
                    Services.TimerService.Timers.Add(t);
                }

                Console.WriteLine("Press any key to stop the server..");
                Console.ReadLine();
            }
        }
    }
}
