using Server.Services;
using System;

namespace Server.Commands
{
    public class CliCommand : CommandService, BaseCommand
     {
          public void Help(string[] command)
          {
               Console.WriteLine("cli - opens up a client which can send commands directly to the server (recommended when performing multiple commands)");
          }

          public void Run(string[] command)
          {
               if (command.Length != 1)
               {
                    Console.WriteLine("Invalid ammount of parameters, use cli [morehelp]");
                    return;
               }

               if (command.Length == 1)
                    Program.stop = false;
               else if (command[1] == "morehelp")
                    Console.WriteLine("Instead of writing mono /path/to/server.exe [command] you'll just need to typ [command]");
          }
     }
}
