using Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Server.Commands
{
    class HelpCommand : CommandService, BaseCommand
    {
        public void Help(string[] command)
        {
            Console.WriteLine("Use help to list all commands, and help command to view info about a certain command");
        }

        public void Run(string[] command)
        {
            if (command.Length != 1 && command.Length != 2)
            {
                Console.WriteLine("Invalid ammount of parameters, use help [command]");
                return;
            }

            if (command.Length == 1)
            {
                Console.WriteLine("Aviable commands: ");
                foreach (var cmd in RegisteredCommands) Console.WriteLine(cmd.Key);

                Help(command);
            }
            else
            {
                BaseCommand b;
                if (RegisteredCommands.TryGetValue(command[1], out b))
                {
                    List<string> l = command.ToList();

                    l.RemoveAt(0);
                    Console.WriteLine(command[1] + ":");
                    b.Help(l.ToArray());
                }
                else
                {
                    Console.WriteLine("Command not found");
                }
            }
        }
    }
}
