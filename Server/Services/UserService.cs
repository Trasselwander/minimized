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
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE name=@name", new { name = name }).FirstOrDefault();

        public User GetUserByEmail(string email)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE email=@email", new { email = email }).FirstOrDefault();

        public UserStats GetUserStats(int uid)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats WHERE UID=@uid", new { uid = uid }).FirstOrDefault();

        public League GetUserLeague(int lid)
            => SQLite.GetConnection().Query<League>("SELECT * FROM leagues WHERE ID=@lid", new { lid = lid }).FirstOrDefault();

        public UserStats GetUserStats(string name)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();

        public void GetUserStats(User user)
            => user.userStats = GetUserStats(user.ID);


        public void GetUserLeague(User user)
            => user.league = user.LID != null ? GetUserLeague((int)user.LID) : null;


        public void CreateLeague(League l)
            => SQLite.GetConnection().Query("INSERT INTO leagues (name, start, end) VALUES (@name, @start, @end)", new { l.name, l.start, l.end });


        public User CreateUser(string name, string hash, string email)
        {
            User u = new User() { name = name, hash = hash, email = email };
            CryptoService.HashAndSavePassword(hash, u);
            SQLite.GetConnection().QueryMultiple(@"INSERT INTO users (name, email, hash, salt, lastloggedin, bestrank, age) SELECT @name as name, @email as email, @hash as hash, @salt as salt, @time as lastloggedin, (SELECT COUNT(*) FROM users) AS bestrank, @time AS age; 
                                                   INSERT INTO userstats (UID, bestrank)
	                                                   SELECT (SELECT ID FROM users WHERE users.name = @name) AS UID, COUNT(*) AS bestrank FROM users;"
                                                   , new { name = u.name, email = u.email, hash = u.hash, salt = u.salt, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

            return u;
        }

        public int GetUserRank2(User u)
            => SQLite.GetConnection().Query<int>("SELECT COUNT(*) FROM users INNER JOIN userstats ON userstats.score >  WHERE userdata.LID = @lid ", new { lid = u.LID }).FirstOrDefault();

        public int GetUserRank(User u)
            => SQLite.GetConnection().Query<int>(@"SELECT COUNT(*) as s FROM users WHERE users.LID = @lid
                                                      SELECT * FROM s WHERE s.UID = @uid", new { lid = u.LID, uid = u.ID }).FirstOrDefault();

        //public User GetOpponent(User u)
        //{
        //    if (u.userStats == null)
        //        u.userStats = GetUserStats(u.ID);

        //    int worst_rank = SQLite.GetConnection().Query<int>("SELECT COUNT(*) FROM users INNER JOIN userdata ON userdata.LID=@lid", new { lid = u.userData.LID }).FirstOrDefault();

        //    Random rand = new Random(); // reuse this if you are generating many
        //    int random_rank = u.userStats.rank;

        //    while (random_rank == u.userStats.rank) // There may be errors inside of this loop.
        //    {
        //        if (u.userStats.rank >= 5)
        //            random_rank = rand.Next(1, 10);
        //        else if (u.userStats.rank + 5 > worst_rank)
        //            random_rank = rand.Next(worst_rank - 10, worst_rank);
        //        else
        //            random_rank = rand.Next(u.userStats.rank - 5, u.userStats.rank + 5);
        //    }

        //    return SQLite.GetConnection().Query<User>("SELECT * FROM users INNER JOIN userdata ON userdata.LID=@lid ORDER BY userdata.score LIMIT 1 OFFSET @rank", new { lid = u.userData.LID, rank = random_rank }).FirstOrDefault();
        //}

        public void JoinLeague(User u, int lid)
        {
            // INSERT NEW USERSTATS
            // CHANGE USERDATA LID to CURRENT LID
            SQLite.GetConnection().QueryMultiple(@"DELETE FROM userstats WHERE userstats.uid = @uid;
                                                   INSERT INTO userstats (UID, bestrank)
                                                   SELECT @uid AS UID,
	                                                   (SELECT COUNT(*) FROM users WHERE users.lid = @lid) AS bestrank;
                                                   UPDATE users SET LID=@lid WHERE users.ID = @uid;", new { uid = u.ID, lid = lid });
        }
        public void LeaveLeague(User u, int lid) //jag tror inte att detta funkar till 100% //JK funkar ayy lamo
        {
            SQLite.GetConnection().QueryMultiple(@"UPDATE users SET LID=null WHERE users.ID = @uid;", new { uid = u.ID, lid = lid });
        }
        public List<League> GetLeagues()
        {
            List<League> leauge = SQLite.GetConnection().Query<League>("SELECT * FROM leagues").ToList();

            foreach (var l in leauge)
            {
                var d = SQLite.GetConnection().Query<League>(@"SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                var data = SQLite.GetConnection().Query<League>(@"SELECT 
                                                                    SUM(userstats.life), 
                                                                    SUM(userstats.speed),
                                                                    SUM(userstats.physicalattack), 
                                                                    SUM(userstats.physicaldefence), 
                                                                    SUM(userstats.magicattack), 
                                                                    SUM(userstats.magicdefence) 
                                                                 FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                l.life = data.life;
                l.speed = data.speed;
                l.physicalattack = data.physicalattack;
                l.physicaldefence = data.physicaldefence;
                l.magicattack = data.magicattack;
                l.magicdefence = data.magicdefence;
            }

            return leauge;
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
            [JsonIgnore]
            public string email { get; set; }

            public int? LID { get; set; }
            public int? HID { get; set; }
            public int bestrank { get; set; }
            public long age { get; set; }
            public int totalwins { get; set; }
            public int totallosses { get; set; }
            public int skillpoints { get; set; }
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

            // Dynamic
            public int rank { get; set; }
        }
    }
}
