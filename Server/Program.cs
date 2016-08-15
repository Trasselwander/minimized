using System;
using Nancy.Hosting.Self;

namespace Server
{
    class Program
    {
        public static bool stop = true;

        static void Main(string[] args)
        {
            Console.WriteLine("Creating database...");
            SQLite.InitDatabase();

            if (args.Length != 0)
            {
                Console.WriteLine("Running in client mode.");

                Services.CommandService.RegisteredCommands.Add("league", new Commands.LeagueCommand());
                Services.CommandService.RegisteredCommands.Add("help", new Commands.HelpCommand());
                Services.CommandService.RegisteredCommands.Add("exit", new Commands.ExitCommand());
                Services.CommandService.RegisteredCommands.Add("db", new Commands.DbCommand());
                Services.CommandService.RegisteredCommands.Add("cli", new Commands.CliCommand());

                Console.WriteLine("Write exit to terminate and help for some help");

                string cmd = string.Join(" ", args);
                do
                {
                    try
                    {
                        Services.CommandService.Process(cmd);
                    }
                    catch (Exception)
                    {
                        Console.Write("A command should not be able to crash the whole server, something smells rotten... *YOUR CODE*");
                    }
                    Console.WriteLine();
                    cmd = Console.ReadLine();
                } while (!stop);
            }
            else
            {
                Console.WriteLine("Running in server mode.");

                using (var host = new NancyHost(new Uri("http://localhost:1235"), new CustomBootstraper()))
                {
                    host.Start();
                    Console.WriteLine("Running nancy on http://localhost:1235");

                    Console.WriteLine("Starting timers..");
                    Services.TimerService.InitTimers();

                    while (true) System.Threading.Thread.Sleep(10);
                }
            }
        }
    }
}
