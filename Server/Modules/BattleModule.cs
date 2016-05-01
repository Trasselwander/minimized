using Nancy;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Server.Services.UserService;

namespace Server.Modules
{
    public class BattleModule : HelperModule
    {
        public BattleModule()
            : base("api/battle")
        {
            Get["/"] = parameters =>
            {


                return null;
            };

            Get["/init/{id:int}"] = parameters => // set time
            {
                User user = AuthorizeUser();
                if ((string)parameters.id == null) return CreateResponse(Nancy.HttpStatusCode.BadRequest, "Invalid defender id.");
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetBattle(parameters.id, user)));
            };

            Get["/attack/{id}"] = parameters => // 
            {


                return null;
            };
        }
    }
}
