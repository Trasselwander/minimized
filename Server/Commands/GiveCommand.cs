using Server.Services;
using System;
using static Server.Services.UserService;

namespace Server.Commands
{
    class GiveCommand : CommandService, BaseCommand
    {
        public void Help(string[] command)
        {
            Console.WriteLine("give player {type} ammount - note that it may be slow to give someone a lot of something");
            Console.WriteLine("  type: {sp, }");
        }

        public void Run(string[] command)
        {
            if (command.Length != 1 + 3)
            {
                Console.WriteLine("Invalid ammount of parameters, use give player type ammount");
                return;
            }

            User u = Users.GetUser(command[1]);
            if (u == null)
            {
                Console.WriteLine("User not found");
                return;
            }

            string type = command[2].ToLower();
            int ammount = int.Parse(command[3]);

            // give ammount of skillpoints
            switch (type)
            {
                case "lvl":
                case "level":
                    type = "level";
                    break;
                case "l":
                case "life":
                    type = "life";
                    break;
                case "s":
                case "speed":
                    type = "speed";
                    break;
                case "pa":
                case "physicalattack":
                    type = "physicalattack";
                    break;
                case "pd":
                case "physicaldefence":
                    type = "physicalattack";
                    break;
                case "ma":
                case "magicattack":
                    type = "magicattack";
                    break;
                case "md":
                case "magicdefence":
                    type = "magicattack";
                    break;
                case "sp":
                case "skillpoints":
                    type = null;
                    break;
                default:
                    Console.WriteLine("Invalid stat");
                    return;
            }

            Users.GetUserStats(u);
            if (u.userStats == null)
            {
                Console.WriteLine("User needs to be in league");
                return;
            }

            u.userStats.skillpoints += ammount;
            if (type == "level")
            {
                u.userStats.level += ammount;
                Users.SaveScoreExpSPAndLevel(u);
                Console.WriteLine("Done!");
                return;
            }

            if (type == "skillpoints")
            {
                Console.WriteLine("Done!");
                return;
            }

            Users.SaveScoreExpSPAndLevel(u);
            for (int i = 0; i < ammount; i++) // This could be optimized;
                Users.IncrementStat(type, u);

            Console.WriteLine("Done!");
        }
    }
}
