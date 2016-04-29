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
            //Get["/list"] = parameters =>
            //{
            //    Services.UserService.User user = AuthorizeUser();
            //    user.userData = Users.GetUserData(user.ID);
            //    var a = Users.GetUsersFromRank(user.userData.rank);

            //    return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(a));
            //};
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
        }
    }
}
