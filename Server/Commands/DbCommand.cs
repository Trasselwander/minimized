using Server.Services;
using System;
using System.IO;

namespace Server.Commands
{
    public class DbCommand : CommandService, BaseCommand
    {
        public void Help(string[] command)
        {
            Console.WriteLine("db delete|wipe|drop - wipes the database");
        }

        public void Run(string[] command)
        {
            if (command.Length != 1 + 1)
            {
                Console.WriteLine("Invalid ammount of parameters, use db delete|wipe|drop");
                return;
            }

            string action = command[1];
            switch (action)
            {
                case "delete":
                case "wipe":
                case "drop":
                    File.Delete("minimal.db");
                    SQLite.InitDatabase();
                    Console.WriteLine("DB file deleted");
                    break;
                default:
                    Console.WriteLine("Command not found, use help db for help");
                    break;
            }
        }
    }
}
