﻿using Nancy;
using Server.Services;
using Newtonsoft.Json;

namespace Server.Modules
{
    public class TestModule : HelperModule
    {
        public TestModule()
            : base("api/test")
        {
            Get["/users"] = parameters =>
            {
                for (int i = 0; i < 20; i++)
                {
                    UserService.User u = Users.CreateUser("test" + i, "" + hashpw("asdasd"));
                    u = Users.GetUser(u.name);
                    Users.JoinLeague(u, 1);
                    u.LID = 1;
                    Users.GetUserStats(u);

                    u.userStats.score = i;
                    Users.SetScore(u);
                }

                return null;
            };

            Get["/users2"] = parameters =>
            {
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(RandomService.rnd.Next(1, 10)));
            };


            Get["/users3"] = parameters =>
            {
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetUser("adam")));
            };

        }

        int hashpw(string pw)
        {
            int hash = 0, i, chr, len;

            for (i = 0, len = pw.Length; i < len; i++)
            {
                chr = (int)pw[i];
                hash = ((hash << 5) - hash) + (int)chr;
                hash |= 0; // Convert to 32bit integer

            }

            return hash;
        }
    }
}