using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;
using Newtonsoft.Json;
using static Server.Services.UserService;
using Server.Services;

namespace Server.Modules
{
    public class PlayersModule : HelperModule
    {
        public PlayersModule()
            : base("api/players")
        {

            Get["/player"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.GetUserStats(user);
                Users.GetUserLeague(user);
                Users.GetRank(user);
                Users.GetWinsAndLossesByID(user);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(user));
            };

            Get["/enemy"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.GetUserStats(user);

                User[] users = Users.GetCloseUsersByScore(user).ToArray();
                if (users.Length == 0) return CreateResponse(HttpStatusCode.BadRequest, "Forever alone.");

                int random = RandomService.rnd.Next(users.Length);

                Users.GetUserStats(users[random]);
                Users.GetRank(users[random]);
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(users[random]));
            };

            Get["/attack/{id}"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.GetUserStats(user);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetCloseUsersByScore(user)));
            };

            Get["/levelup/{id}"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.GetUserStats(user);

                if (user.userStats == null || user.userStats.skillpoints < 1)
                    return CreateResponse(HttpStatusCode.BadRequest, "Not enough skillpoints");

                switch (((string)parameters.id).ToLower())
                {
                    case "1":
                    case "life":
                        Users.IncrementStat("life", user);
                        break;
                    case "2":
                    case "speed":
                        Users.IncrementStat("speed", user);
                        break;
                    case "3":
                    case "physicalattack":
                        Users.IncrementStat("physicalattack", user);
                        break;
                    case "4":
                    case "physicaldefence":
                        Users.IncrementStat("physicaldefence", user);
                        break;
                    case "5":
                    case "magicattack":
                        Users.IncrementStat("magicattack", user);
                        break;
                    case "6":
                    case "magicdefence":
                        Users.IncrementStat("magicdefence", user);
                        break;

                    default:
                        return CreateResponse(HttpStatusCode.BadRequest);
                }

                return CreateResponse(HttpStatusCode.OK);
            };
        }
    }
}
