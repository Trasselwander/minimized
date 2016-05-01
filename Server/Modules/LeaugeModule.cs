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
    public class LeaugeModule : HelperModule
    {
        public LeaugeModule()
            : base("api/leagues")
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

            Get["/list"] = parameters =>
            {
                User user = AuthorizeUser();
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetLeagues()));
            };

            Get["/join/{id}"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.JoinLeague(user, parameters.id);
                return CreateResponse(HttpStatusCode.OK);
            };

            Get["/leave"] = parameters =>
            {
                User user = AuthorizeUser();
                Users.LeaveLeague(user); // ID't spelar ingen roll eftersom man inte kan lämna en league man inte är med i.
                return CreateResponse(HttpStatusCode.OK);
            };
        }
    }
}
