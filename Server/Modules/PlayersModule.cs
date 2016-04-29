using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;
using Newtonsoft.Json;

namespace Server.Modules
{
    public class PlayersModule : HelperModule
    {
        public PlayersModule()
            : base("api/players")
        {
            Get["/top/{id}"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetTopByLeauge(parameters.id)));
            };

            Get["/top10/{id}"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetTop10ByLeauge(parameters.id)));
            };

            Get["/player"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                Users.GetUserStats(user);
                Users.GetUserLeague(user);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(user));
            };

            Get["/enemy"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                Users.GetUserStats(user);
                Users.GetUserLeague(user);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetCloseUsersByScore(user)));
            };

            Get["/levelup/{id}"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                Users.GetUserStats(user);

                if (user.userStats == null || user.userStats.skillpoints < 1)
                    return CreateResponse(HttpStatusCode.BadRequest);

                switch ((parameters.id as string).ToLower())
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
