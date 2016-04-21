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
            Get["/list"] = parameters =>
            {
                //Services.UserService.User user = AuthorizeUser();

                var a = Users.GetUsersFromRank(10);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(a));
            };

        }
    }
}
