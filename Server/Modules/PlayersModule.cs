using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;

namespace Server.Modules
{
    class PlayersModule : HelperModule
    {
        public PlayersModule()
            : base("api/players")
        {
            Get["/list"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();


                return CreateResponse(HttpStatusCode.Forbidden);
            };

        }
    }
}
