using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;
using Newtonsoft.Json;
using static Server.Services.UserService;

namespace Server.Modules
{
    public class PlayersModule : HelperModule
    {
        public PlayersModule()
            : base("api/players")
        {
            Get["/top/{id}"] = parameters =>
            {
                User user = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetTopByLeauge(parameters.id)));
            };

            Get["/top10/{id}"] = parameters =>
            {
                User user = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetTop10ByLeauge(parameters.id)));
            };

            Get["/player"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.GetUserStats(user);
                Users.GetUserLeague(user);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(user));
            };

            Get["/enemy"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.GetUserStats(user);

                User[] users = Users.GetCloseUsersByScore(user).ToArray();
                if (users.Length == 0) CreateResponse(HttpStatusCode.BadRequest, "Forever alone.");


                int random = new Random().Next(0, users.Length - 1);

                Users.GetUserStats(users[random]);
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
                    return CreateResponse(HttpStatusCode.BadRequest);

                Users.IncrementStat(((string)parameters.id).ToLower(), user);
                return CreateResponse(HttpStatusCode.OK);
            };
        }
    }
}
