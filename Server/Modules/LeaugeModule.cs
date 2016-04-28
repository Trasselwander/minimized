using Nancy;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Modules
{
    public class LeaugeModule : HelperModule
    {
        public LeaugeModule()
            : base("api/leagues")
        {
            Get["/list"] = parameters =>
            {
                // sendRequest("/leauges/list", function(text) { console.log(text) });
                Services.UserService.User user = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetLeagues()));
            };

            Get["/join/{id}"] = parameters =>
            {
                // sendRequest("/leauges/list", function(text) { console.log(text) });
                Services.UserService.User user = AuthorizeUser();
                Users.JoinLeague(user, parameters.id);
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetLeagues()));
            };
            Get["/leave/{id}"] = parameters =>
            {
                Services.UserService.User user = AuthorizeUser();
                Users.LeaveLeague(user, parameters.id);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetLeagues()));
            };
        }
    }
}
