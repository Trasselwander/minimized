﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nancy;

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
                    Services.UserService.User u = Users.CreateUser("test" + i, "" + hashpw("asdasd"), "test" + i);
                    u = Users.GetUser(u.name);
                    Users.JoinLeague(u, 1);
                    u.LID = 1;
                    Users.GetUserStats(u);

                    u.userStats.score = i;
                    Users.SetScore(u);
                }

                return null;
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