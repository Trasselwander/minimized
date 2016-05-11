using System;
using Nancy.Hosting.Self;
using Server.Modules;

namespace Server
{
    class Program
    {
        public static bool stop = false;

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

                Services.CommandService.RegisteredCommands.Add("league", new Commands.LeagueCommand());
                Services.CommandService.RegisteredCommands.Add("help", new Commands.HelpCommand());
                Services.CommandService.RegisteredCommands.Add("exit", new Commands.ExitCommand());

                Console.WriteLine("Write exit to terminate and help for some help");

                while (!stop)
                {
                    string cmd = Console.ReadLine();
                    Console.WriteLine();

                    try
                    {
                        Services.CommandService.Process(cmd);
                    }
                    catch (Exception)
                    {
                        Console.Write("A command should not be able to crash the whole server, something smells rotten... *YOUR CODE*");
                    }
                    Console.WriteLine();
                }
                
            }
        }
    }
}
