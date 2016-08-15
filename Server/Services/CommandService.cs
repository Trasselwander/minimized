using System;
using System.Collections.Generic;

namespace Server.Services
{
    public class CommandService
    {
        public static Dictionary<string, BaseCommand> RegisteredCommands = new Dictionary<string, BaseCommand>();
        public static UserService Users = new UserService();

        public static void Process(string command)
        {
            string cmd = command.Split(' ')[0];

            BaseCommand result;
            if (RegisteredCommands.TryGetValue(cmd, out result))
                result.Run(command.Split(' '));
            else
                Console.WriteLine("Command not found. Use the help command for help");
        }
    }


    public interface BaseCommand
    {
        void Help(string[] command);
        void Run(string[] command);
    }
}
