using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Newtonsoft.Json;

namespace Server.Services
{
    public class UserService
    {
        public User GetUser(string name)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE LOWER(name)=LOWER(@name)", new { name = name }).FirstOrDefault();

        public User GetUser(int uid)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE ID=@uid", new { uid = uid }).FirstOrDefault();

        public UserStats GetUserStats(int uid, int lid)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats WHERE UID=@uid AND LID=@lid", new { uid = uid, lid = lid }).FirstOrDefault();

        public League GetUserLeague(int lid)
            => SQLite.GetConnection().Query<League>("SELECT * FROM leagues WHERE ID=@lid", new { lid = lid }).FirstOrDefault();

        public UserStats GetUserStats(string name)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();

        public void GetUserStats(User user)
            => user.userStats = user.LID != null ? GetUserStats(user.ID, (int)user.LID) : null;

        public void GetUserLeague(User user)
            => user.league = user.LID != null ? GetUserLeague((int)user.LID) : null;

        public List<User> GetUsersByLeague(League league)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users where LID = @lid", new { lid = league.ID }).ToList();

        public void CreateLeague(League l)
            => SQLite.GetConnection().Query("INSERT INTO leagues (name, start, end) VALUES (@name, @start, @end)", new { l.name, l.start, l.end });

        public void SetScore(User u) // Do not use this function.
            => SQLite.GetConnection().Query("UPDATE userstats SET score=@score WHERE userstats.UID = @uid AND userstats.LID = @lid", new { score = u.userStats.score, uid = u.ID, lid = u.LID });

        public List<User> GetCloseUsersByScore(User u)
            => u.userStats == null ? null : SQLite.GetConnection().Query<User>(@"SELECT *, (abs(userstats.score - @score)) as absscore FROM userstats INNER JOIN users ON users.LID = @lid AND userstats.LID = @lid AND users.ID = userstats.UID AND NOT users.ID = @uid ORDER BY absscore LIMIT 10", new { lid = u.LID, score = u.userStats.score, uid = u.ID }).ToList();

        public List<User> GetTop10ByLeauge(User u)
            => u.LID == null ? null : GetTop10ByLeauge((int)u.LID);

        public List<User> GetTopByLeauge(User u)
            => u.LID == null ? null : GetTopByLeauge((int)u.LID);

        public List<User> GetTopByLeauge(int lid)
            => SQLite.GetConnection().Query(@"SELECT * FROM users INNER JOIN userstats ON users.LID = @lid AND userstats.LID = @lid AND users.ID = userstats.UID ORDER BY userstats.score DESC", (User user, UserStats stats) => { user.userStats = stats; return user; }, new { lid = lid }).ToList();

        public List<User> GetTop10ByLeauge(int lid)
            => SQLite.GetConnection().Query(@"SELECT * FROM users INNER JOIN userstats ON users.LID = @lid AND userstats.LID = @lid AND users.ID = userstats.UID ORDER BY userstats.score DESC LIMIT 10", (User user, UserStats stats) =>
            {
                user.userStats = stats; return user;
            }, new { lid = lid }).ToList();

        public void UpdateLastLoggedIn(User u)
            => SQLite.GetConnection().Query("UPDATE users SET lastloggedin=@time WHERE users.ID = @uid", new { uid = u.ID, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

        public void IncrementStat(string stat, User u)
            => SQLite.GetConnection().Query("UPDATE userstats SET " + stat + " = " + stat + " + 1, skillpoints = skillpoints - 1 WHERE userstats.UID = @uid AND userstats.LID = @lid", new { uid = u.ID, lid = u.LID });

        public void SaveScoreExpSPAndLevel(User u)
            => SQLite.GetConnection().Query("UPDATE userstats SET score = @score, exp = @exp, level = @level, skillpoints = @sp WHERE userstats.UID = @uid AND userstats.LID = @lid", new { uid = u.ID, lid = u.LID, score = u.userStats.score, exp = u.userStats.exp, level = u.userStats.level, sp = u.userStats.skillpoints });


        public void UpdateLevel(User user)
        {
            if (user.userStats == null) GetUserStats(user);

            while (user.userStats.exp >= (int)Math.Ceiling(10 * Math.Pow(user.userStats.level, 1.4)))
            {
                user.userStats.exp -= (int)Math.Ceiling(10 * Math.Pow(user.userStats.level, 1.4));
                user.userStats.level++;
                user.userStats.skillpoints += 4;
            }
        }

        public void GetRank(User user)
        {
            if (user.userStats == null) return;

            int[] scores = SQLite.GetConnection().Query<int>("SELECT score FROM userstats INNER JOIN users ON userstats.score > @score AND userstats.UID = users.ID AND userstats.LID = users.LID ORDER BY userstats.score DESC", new { score = user.userStats.score }).ToArray();

            int ind = scores.Length + 1;
            int last = -1;
            for (int i = 0; i < scores.Length; i++)
                if (last == scores[i]) ind--;

            user.userStats.rank = ind;
        }

        public User CreateUser(string name, string hash)
        {
            User u = new User() { name = name, hash = hash };

            if (GetUser(name) != null) throw new HttpErrorException(Nancy.HttpStatusCode.BadRequest, "Username already in use.");

            CryptoService.HashAndSavePassword(hash, u);
            SQLite.GetConnection().Query(@"INSERT INTO users (name, hash, salt, lastloggedin, bestrank, age) SELECT @name as name, @hash as hash, @salt as salt, @time as lastloggedin, (SELECT COUNT(*) FROM users) AS bestrank, @time AS age",
                                            new { name = u.name, hash = u.hash, salt = u.salt, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

            return GetUser(name);
        }

        public User GetOpponent(User u)
        {
            if (u.LID == null) return null;

            if (u.userStats == null) GetUserStats(u);

            User[] users = GetCloseUsersByScore(u).ToArray();
            return users[(new Random()).Next(0, users.Length - 1)];
        }

        public void JoinLeague(User u, int lid)
        {
            SQLite.GetConnection().QueryMultiple(@"DELETE FROM userstats WHERE userstats.UID = @uid AND userstats.LID = @lid;
                                                   INSERT INTO userstats (UID, LID, bestrank)
                                                   SELECT @uid AS UID, @lid AS LID,
	                                                   (SELECT COUNT(*) FROM users WHERE users.LID = @lid) AS bestrank;
                                                   UPDATE users SET LID=@lid WHERE users.ID = @uid;", new { uid = u.ID, lid = lid });
        }
        public void LeaveLeague(User u)
            => SQLite.GetConnection().QueryMultiple(@"UPDATE users SET LID=null WHERE users.ID = @uid;", new { uid = u.ID, u.LID });

        public List<League> GetLeagues()
        {
            List<League> leauge = SQLite.GetConnection().Query<League>("SELECT * FROM leagues").ToList();

            foreach (var l in leauge)
            {
                var d = SQLite.GetConnection().Query<League>(@"SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND userstats.LID=@lid AND users.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                var data = SQLite.GetConnection().Query<League>(@"SELECT 
                                                                    SUM(userstats.life) AS life, 
                                                                    SUM(userstats.speed) AS speed,
                                                                    SUM(userstats.physicalattack) AS physicalattack, 
                                                                    SUM(userstats.physicaldefence) AS physicaldefence, 
                                                                    SUM(userstats.magicattack) AS magicattack, 
                                                                    SUM(userstats.magicdefence) AS magicdefence
                                                                 FROM userstats INNER JOIN users ON userstats.UID=users.ID AND userstats.LID=@lid AND users.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                l.leader = SQLite.GetConnection().Query<string>(@"SELECT name FROM users INNER JOIN userstats ON users.ID=userstats.UID AND userstats.LID=@lid AND users.LID=@lid ORDER BY SCORE DESC LIMIT 1", new { lid = l.ID }).FirstOrDefault();

                GetLeagueStatsByLeague(l);
                l.life = data.life;
                l.speed = data.speed;
                l.physicalattack = data.physicalattack;
                l.physicaldefence = data.physicaldefence;
                l.magicattack = data.magicattack;
                l.magicdefence = data.magicdefence;
            }

            return leauge;
        }


        public Battle GetBattle(int did, User user) // defender id
        {
            Attack a = GetAttack(user);
            if (a != null) throw new HttpErrorException(Nancy.HttpStatusCode.BadRequest, "Raden Adam missade.");

            User defender = GetUser(did);
            GetUserStats(defender);

            int timelimit = SQLite.GetConnection().Query<int>(@"SELECT 1 FROM attacks WHERE start > @time LIMIT 1", new { time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) - 4000, uid = user.ID, lid = user.LID }).FirstOrDefault();
            if (timelimit == 1) throw new HttpErrorException(Nancy.HttpStatusCode.BadRequest, "You can't attack that fast.");

            if (user.userStats == null) GetUserStats(user);
            if (defender.LID != user.LID) throw new HttpErrorException(Nancy.HttpStatusCode.BadRequest, "Invalid defender id, user from another league.");

            SQLite.GetConnection().Query(@"INSERT INTO attacks (LID, AID, DID, DHP, AHP, start)
                                             SELECT @lid AS LID, @aid AS AID, @did AS DID, @dhp AS DHP, @ahp AS AHP, @time as start",
                                                new { lid = user.LID, aid = user.ID, did = defender.ID, dhp = defender.userStats.life, ahp = user.userStats.life, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

            return new Battle { enemyHP = defender.userStats.life, playerHP = user.userStats.life };
        }

        public Attack GetAttack(User user)
            => SQLite.GetConnection().Query<Attack>("SELECT * FROM attacks WHERE AHP > 0 AND DHP > 0 AND AID = @uid", new { uid = user.ID }).FirstOrDefault();

        public void SaveAttack(Attack attack)
            => SQLite.GetConnection().Query<Attack>("UPDATE attacks SET AHP = @ahp, DHP = @dhp, DDUP = @ddup, DAUP = @daup WHERE AHP > 0 AND DHP > 0 AND AID = @aid", new { aid = attack.AID, ahp = attack.AHP, dhp = attack.DHP, ddup = attack.DDUP, daup = attack.DAUP }).FirstOrDefault();

        public List<Attack> GetAttacksByID(User user)
            => SQLite.GetConnection().Query<Attack>("SELECT * FROM attacks where AID = @uid", new { uid = user.ID }).ToList();
        public List<Attack> GetAttacksByLeague(League league)
            => SQLite.GetConnection().Query<Attack>("SELECT * FROM attacks where LID = @lid", new { lid = league.ID }).ToList();

        public void GetWinsAndLossesByID(User user)
        {
            List<Attack> total = GetAttacksByID(user);
            for (int i = 0; i < total.Count; i++)
            {
                if (total[i].LID == user.LID)
                {
                    if (total[i].AHP <= 0) user.userStats.losses++;
                    else if (total[i].DHP <= 0) user.userStats.wins++;
                }
                if (total[i].AHP <= 0) user.totallosses++;
                else if (total[i].DHP <= 0) user.totalwins++;
            }
        }
        public void GetLeagueStatsByLeague(League league)
        {
            league.totalfights = GetAttacksByLeague(league).Count;
            league.totalplayers = GetUsersByLeague(league).Count;
            league.highestlevel = SQLite.GetConnection().Query<int>(@"SELECT level FROM userstats INNER JOIN users ON users.ID=userstats.UID AND userstats.LID=@lid AND users.LID=@lid ORDER BY SCORE DESC LIMIT 1", new { lid = league.ID }).FirstOrDefault();
        }
        public class Attack
        {
            public int ID { get; set; }
            public int LID { get; set; }
            public int AID { get; set; }
            public int DID { get; set; }
            public int DHP { get; set; }
            public int AHP { get; set; }
            public int DDUP { get; set; }
            public int DAUP { get; set; }
            public long start { get; set; }

            public int damage { get; set; } // dynamic
        }

        public class Battle
        {
            public int playerHP { get; set; }
            public int enemyHP { get; set; }
            public int enemyAttackType { get; set; }
            public bool playerFirstRound { get; set; }
        }

        public class League
        {
            public int ID { get; set; }
            public string name { get; set; }
            public long start { get; set; } // age
            public long end { get; set; } // time left

            // Dynamic 
            public int totalplayers { get; set; }
            public int highestlevel { get; set; }
            public int totalfights { get; set; } // count all kills or loses

            public int life { get; set; }
            public int speed { get; set; }
            public int physicalattack { get; set; }
            public int physicaldefence { get; set; }
            public int magicattack { get; set; }
            public int magicdefence { get; set; }

            public string leader { get; set; } //
                                               // mostactive, etc.
        }

        public class User
        {
            public UserStats userStats { get; set; }
            public League league { get; set; }
            public long lastloggedin { get; set; }
            public int ID { get; set; }
            public string name { get; set; }
            [JsonIgnore]
            public string hash { get; set; }
            [JsonIgnore]
            public string salt { get; set; }

            public int? LID { get; set; }
            public int? HID { get; set; }
            public int bestrank { get; set; }
            public long age { get; set; }
            public int totalwins { get; set; }
            public int totallosses { get; set; }
        }

        public class UserStats
        {
            public int ID { get; set; }
            public int UID { get; set; }
            public int life { get; set; }
            public int speed { get; set; }
            public int physicalattack { get; set; }
            public int physicaldefence { get; set; }
            public int magicattack { get; set; }
            public int magicdefence { get; set; }

            public int bestrank { get; set; }
            public int wins { get; set; }
            public int losses { get; set; }
            public int level { get; set; }
            public int score { get; set; }
            public int exp { get; set; }
            public int skillpoints { get; set; }

            // Dynamic
            public int rank { get; set; }
        }
    }
}
