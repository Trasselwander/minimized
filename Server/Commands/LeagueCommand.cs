using Server.Services;
using System;
using System.Collections.Generic;
using static Server.Services.UserService;

namespace Server.Commands
{
    class LeagueCommand : CommandService, BaseCommand
    {
        public void Help(string[] command)
        {
            Console.WriteLine("leagues {action} {params}");
            Console.WriteLine("  action: {create, list}");
            Console.WriteLine("    create: {name, [start], end}");
            Console.WriteLine("    list: {}");
        }

        public void Run(string[] command)
        {
            if (1 >= command.Length) return;
            string action = command[1];
            switch (action)
            {
                case "create":
                    if (command.Length != 2 + 3 && command.Length != 2 + 2)
                    {
                        Console.WriteLine("Invalid ammount of parameters, use league create name|start|end where end and start is in minutes from now");
                        return;
                    }

                    string name = command[2];
                    long end, start;
                    end = start = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds);

                    if (command.Length == 3 + 2)
                    {
                        start += int.Parse(command[3]) * 60 * 1000;
                        end += int.Parse(command[4]) * 60 * 1000;
                    }
                    else
                    {
                        start += int.Parse(command[3]) * 60 * 1000;
                    }

                    Users.CreateLeague(new League() { name = name, start = start, end = end });
                    Console.WriteLine("Leauge created with the name " + name);
                    break;
                case "list":
                    if (command.Length != 2)
                    {
                        Console.WriteLine("Invalid ammount of parameters, use league list");
                        return;
                    }

                    List<League> ls = Users.GetLeagues();
                    Console.WriteLine(string.Format("|{0,15}|{1,15}|{2,15}|{3,15}|", "ID", "Name", "Start", "End"));

                    foreach (var l in ls)
                        Console.WriteLine(string.Format("|{0,15}|{1,15}|{2,15}|{3,15}|", l.ID, l.name, l.start, l.end));

                    break;
                default:
                    break;
            }

        }
    }
}
