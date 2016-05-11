using Server.Services;
using System;

namespace Server.Commands
{
    public class ExitCommand : CommandService, BaseCommand
    {
        public void Help(string[] command)
        {
            Console.WriteLine("Just terminates the application. This command does not accept any arguments.");
        }

        public void Run(string[] command)
        {
            if (command.Length != 1)
            {
                Console.WriteLine("Invalid ammount of parameters, use exit");
                return;
            }

            Program.stop = true;
        }
    }
}
