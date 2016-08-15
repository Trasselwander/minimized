﻿using Nancy;
using Newtonsoft.Json;
using Server.Services;
using System;
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
                User user = AuthorizeUser();
                Attack a = Users.GetAttack(user);

                if (a == null) return CreateResponse(HttpStatusCode.OK);

                User defender = Users.GetUser(a.DID);

                if (defender.LID == null)
                {
                    a.AHP = 0;
                    Users.SaveAttack(a);
                    return CreateResponse(HttpStatusCode.OK);
                }

                Users.GetUserStats(defender);
                a.DTHP = defender.userStats.life;

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(a));
            };

            Get["/init/{id}"] = parameters => // set time
            {
                User user = AuthorizeUser();
                string s = (string)parameters.id;
                if (s == null) return CreateResponse(HttpStatusCode.BadRequest, "Invalid defender id.");
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetBattle(int.Parse(s), user)));
            };

            Get["/attack/{id}"] = parameters => // 
            {
                // Get both players. SELECT * FROM attacks WHERE AHP > 0 AND DHP > 0 AND AID = @uid
                User user = AuthorizeUser();
                Attack a = Users.GetAttack(user);
                if (a == null) return CreateResponse(HttpStatusCode.BadRequest, "No one to attack.");

                User enemy = Users.GetUser(a.DID);

                Users.GetUserStats(user);
                Users.GetUserStats(enemy);
                // Börja med 10 hp;

                string aatk = ((string)parameters.id).ToLower();
                string eatk = RandomService.rnd.Next(1, 4 + 1) + "";

                if (aatk == "4") a.DAUP++;
                if (eatk == "4") a.DDUP++;

                int aa = CalculateDMG(user, enemy, aatk, a.DDUP, a.DAUP);
                int ea = CalculateDMG(enemy, user, eatk, a.DAUP, a.DDUP);

                if (user.userStats.speed * Math.Pow(1.25, a.DAUP) >= enemy.userStats.speed * Math.Pow(1.25, a.DDUP)) // user is to start even if the same speed because he "attacked".
                {
                    a.DHP -= aa;
                    if (a.DHP > 0) a.AHP -= ea;
                }
                else // Enemy attacks first.
                {
                    a.AHP -= ea;
                    if (a.AHP > 0) a.DHP -= aa;
                }

                if (0 >= a.AHP || 0 >= a.DHP) // någon har dött // (e.lvl)^2/ a.lvl * x
                {
                    int scoex = (int)Math.Ceiling(Math.Pow(enemy.userStats.level + 2, 2) / user.userStats.level);
                    enemy.userStats.exp += (int)Math.Ceiling(scoex * 16 * 0.1);

                    if (0 >= a.AHP)
                    {
                        user.userStats.score -= scoex;
                        user.userStats.exp += (int)Math.Ceiling(scoex * 16 * 0.1);

                        enemy.userStats.score += scoex;
                    }
                    else
                    {
                        user.userStats.score += scoex;
                        user.userStats.exp += scoex * 16;

                        enemy.userStats.score += (int)Math.Ceiling(scoex * 0.1);
                    }

                    Users.UpdateLevel(user);
                    Users.SaveScoreExpSPAndLevel(user);

                    Users.UpdateLevel(enemy);
                    Users.SaveScoreExpSPAndLevel(enemy);
                }

                Users.SaveAttack(a);

                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(new Battle() { enemyHP = a.DHP, playerHP = a.AHP, enemyAttackType = int.Parse(eatk), playerFirstRound = user.userStats.speed * Math.Pow(1.25, a.DAUP) >= enemy.userStats.speed * Math.Pow(1.25, a.DDUP) }));
                // Update here!.

                // Who is to attack first?
                // How much damage?
                // Update db
                // if any player died give EXP to both (equally?)
                // Increase winner score decrease loser score. (should this be connected to EXP?)

                // if EXP is above EXP threshold (algorithm) increase level. 
            };
        }

        int CalculateDMG(User user, User enemy, string attack, int eup, int aup)
        {
            int damage;

            switch (attack)
            {
                case "1": // Normal attack
                    damage = (int)Math.Ceiling((1 - 1 / (Math.Max(user.userStats.physicalattack / (enemy.userStats.physicaldefence * Math.Pow(1.25, eup)), 1) * 2)) * user.userStats.physicalattack); // 50% reduction if physicalattack == physicaldefence (MAX). 
                    // 10 * (attck^2 / (defense + 10)) * attack
                    // HP = 12;
                    // Attack = 7;
                    // Defence = 5;
                    // 
                    // 12  = (7 / (5 * 0.5)( / hpmod
                    // Justera efter varje league. 
                    break; //user.userStats.magicattack
                case "2": // Magisk attack
                    damage = (int)Math.Ceiling((1 - 1 / (Math.Max(user.userStats.magicattack / (enemy.userStats.magicdefence * Math.Pow(1.25, eup)), 1) * 2)) * user.userStats.magicattack); // 50% reduction if physicalattack == physicaldefence (MAX). 
                    break;
                case "3": // Snabbattack
                    damage = (int)Math.Ceiling((1 - 1 / (Math.Max(((user.userStats.speed * Math.Pow(1.25, eup)) * user.userStats.physicalattack) / enemy.userStats.physicaldefence, 1) * 2)) * (user.userStats.speed * Math.Pow(1.25, eup)) / (user.userStats.speed * 0.5)); // 50% reduction if physicalattack == physicaldefence (MAX). 
                    break;
                default:
                    return 0;
            }

            return damage;
        }
    }
}
