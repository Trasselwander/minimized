using System;
using Nancy.Hosting.Self;
using Server.Modules;
using System.Collections.Generic;

namespace Server
{
    class Program
    {
        public static bool stop = false;

        static void Main(string[] args)
        {

            using (var host = new NancyHost(new Uri("http://localhost:1235"), new CustomBootstraper()))
            {
                Console.WriteLine("Creating database...");
                SQLite.InitDatabase();

                host.Start();
                Console.WriteLine("Running nancy on http://localhost:1235");

                Console.WriteLine("Starting timers..");
                Services.TimerService.InitTimers();

                Services.CommandService.RegisteredCommands.Add("league", new Commands.LeagueCommand());
                Services.CommandService.RegisteredCommands.Add("help", new Commands.HelpCommand());
                Services.CommandService.RegisteredCommands.Add("exit", new Commands.ExitCommand());
                Services.CommandService.RegisteredCommands.Add("db", new Commands.DbCommand());

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
