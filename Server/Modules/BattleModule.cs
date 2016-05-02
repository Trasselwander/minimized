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
                if ((string)parameters.id == null) return CreateResponse(HttpStatusCode.BadRequest, "Invalid defender id.");
                return CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(Users.GetBattle(parameters.id, user)));
            };

            Get["/attack/{id:int}"] = parameters => // 
            {
                // Get both players. SELECT * FROM attacks WHERE AHP > 0 AND DHP > 0 AND AID = @uid
                User user = AuthorizeUser();
                Attack a = Users.GetAttack(user);
                if (a == null) return CreateResponse(HttpStatusCode.BadRequest, "No one to attack.");

                User enemy = Users.GetUser(a.DID);

                Users.GetUserStats(user);
                Users.GetUserStats(enemy);
                // Börja med 10 hp;
                if (user.userStats.speed >= enemy.userStats.speed) // user is to start even if the same speed because he "attacked".
                {
                    switch ("sad")
                    {
                        case "1": // Normal attack
                            int damage = user.userStats.physicalattack; // 50% reduction if physicalattack == physicaldefence (MAX). 
                            // 10 * (attck^2 / (defense + 10)) * attack

                            // HP = 12;
                            // Attack = 7;
                            // Defence = 5;
                            // 
                            // 12 = 7 / (5 * 0.5)
                            // Justera efter varje league. 

                            break;
                        case "2": // Magisk attack
                            //user.userStats.magicattack

                            break;
                        case "3": // Snabbattack
                            break;
                        case "4": // Försvar

                            break;
                        default:
                            break;
                    }
                }

                // Who is to attack first?
                // How much damage?
                // Update db
                // if any player died give EXP to both (equally?)
                // Increase winner score decrease loser score. (should this be connected to EXP?)

                // if EXP is above EXP threshold (algorithm) increase level. 



                return null;
            };
        }
    }
}
