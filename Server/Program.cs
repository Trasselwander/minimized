using System;
using Nancy.Hosting.Self;
using Server.Services;
using Mono.Unix.Native;
using Mono.Unix;

namespace Server
{
    class Program
    {
        public static bool stop = true;

        static void Main(string[] args)
        {
            Console.WriteLine("Creating database...");
            SQLite.InitDatabase();

            if (args.Length != 0) ProcessCommands(args);

            Console.WriteLine("Running in server mode.");

            using (var host = new NancyHost(new Uri("http://localhost:1235"), new CustomBootstraper()))
            {
                host.Start();
                Console.WriteLine("Running nancy on http://localhost:1235");

                Console.WriteLine("Enabling timers..");
                TimerService.InitTimers();

                Console.WriteLine("Done.");

                if (Type.GetType("Mono.Runtime") != null)
                    UnixSignal.WaitAny(new UnixSignal[] {
                        new UnixSignal (Signum.SIGINT),
                        new UnixSignal (Signum.SIGTERM),
                    }, -1);
                else
                    Console.ReadLine();
            }
        }

        static void ProcessCommands(string[] args)
        {
            Console.WriteLine("Running in client mode.");

            CommandService.RegisteredCommands.Add("league", new Commands.LeagueCommand());
            CommandService.RegisteredCommands.Add("help", new Commands.HelpCommand());
            CommandService.RegisteredCommands.Add("exit", new Commands.ExitCommand());
            CommandService.RegisteredCommands.Add("db", new Commands.DbCommand());
            CommandService.RegisteredCommands.Add("cli", new Commands.CliCommand());

            Console.WriteLine("Write exit to terminate and help for some help");

            string cmd = string.Join(" ", args);
            while (true)
            {
                try
                {
                    CommandService.Process(cmd);
                    if (stop) return;
                }
                catch (Exception)
                {
                    Console.Write("A command should not be able to crash the whole server, something smells rotten... *YOUR CODE*");
                }
                Console.WriteLine();

                cmd = Console.ReadLine();
            }
        }
    }
}
