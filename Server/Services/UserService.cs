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


        public UserData GetUserData(int uid)
            => SQLite.GetConnection().Query<UserData>("SELECT * FROM userdata WHERE UID=@uid", new { uid = uid }).FirstOrDefault();

        public UserData GetUserData(string name)
            => SQLite.GetConnection().Query<UserData>("SELECT * FROM usersdata INNER JOIN users ON userdata.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();


        public UserStats GetUserStats(int uid)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats WHERE UID=@uid", new { uid = uid }).FirstOrDefault();

        public UserStats GetUserStats(string name)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();

        public void GetUserDataAndStats(User user)
        {
            user.userData = GetUserData(user.ID);
            user.userStats = GetUserStats(user.ID);
        }

        public User CreateUser(string name, string hash, string email)
        {
            User u = new User() { name = name, hash = hash, email = email };
            CryptoService.HashAndSavePassword(hash, u);
            SQLite.GetConnection().QueryMultiple(@"INSERT INTO users (name, email, hash, salt, lastloggedin)VALUES(@name, @email, @hash, @salt, @time); 
                                                   INSERT INTO userstats (UID, bestrank)
                                                   SELECT ID AS UID, 
	                                                   (SELECT COUNT(*) FROM users) AS bestrank 
                                                   FROM users WHERE users.name = @name;
                                                   INSERT INTO userdata (UID, bestrank, age) 
                                                   SELECT ID AS UID, 
	                                                   (SELECT COUNT(*) FROM users) AS bestrank, 
	                                                   @time as time 
                                                   FROM users WHERE users.name = @name;", new { name = u.name, email = u.email, hash = u.hash, salt = u.salt, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

            return u;
        }

        //public int GetUserRank(User u)
        //{
        //    int worst_rank = SQLite.GetConnection().Query<int>("
        //        SELECT COUNT(*) FROM users INNER JOIN userdata ON userdata.LID=@lid ORDER BY userdata.score ", new { lid = u.userData.LID }).FirstOrDefault();
        //}


        //public User GetOpponent(User u)
        //{
        //    if (u.userStats == null)
        //        u.userStats = GetUserStats(u.ID);

        //    int worst_rank = SQLite.GetConnection().Query<int>("SELECT COUNT(*) FROM users INNER JOIN userdata ON userdata.LID=@lid", new { lid = u.userData.LID }).FirstOrDefault();

        //    Random rand = new Random(); //reuse this if you are generating many
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

        public void JoinLeauge(User u, int lid)
        {
            // INSERT NEW USERSTATS
            // CHANGE USERDATA LID to CURRENT LID
            SQLite.GetConnection().QueryMultiple(@"DELETE FROM userstats WHERE userstats.uid = @uid;
                                                   INSERT INTO userstats (UID, bestrank)
                                                   SELECT @uid AS UID,
	                                                   (SELECT COUNT(*) FROM userdata WHERE userdata.lid = @lid) AS bestrank;
                                                   UPDATE userdata SET LID=@lid WHERE userdata.UID = @uid;", new { uid = u.ID, lid = lid });
        }

        public List<Leauge> GetLeagues()
        {
            List<Leauge> leauge = SQLite.GetConnection().Query<Leauge>("SELECT * FROM leagues").ToList();

            foreach (var l in leauge)
            {
                var d = SQLite.GetConnection().Query<Leauge>(@"SELECT * FROM userstats INNER JOIN userdata ON userstats.UID=userdata.UID AND userdata.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                var data = SQLite.GetConnection().Query<Leauge>(@"SELECT 
                                                                    SUM(userstats.life), 
                                                                    SUM(userstats.speed),
                                                                    SUM(userstats.physicalattack), 
                                                                    SUM(userstats.physicaldefence), 
                                                                    SUM(userstats.magicattack), 
                                                                    SUM(userstats.magicdefence) 
                                                                 FROM userstats INNER JOIN userdata ON userstats.UID=userdata.UID AND userdata.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                l.life = data.life;
                l.speed = data.speed;
                l.physicalattack = data.physicalattack;
                l.physicaldefence = data.physicaldefence;
                l.magicattack = data.magicattack;
                l.magicdefence = data.magicdefence;
            }

            return leauge;
        }


        public void CreateLeague(Leauge l)
            => SQLite.GetConnection().Query("INSERT INTO leagues (name, start, end) VALUES (@name, @start, @end)", new { l.name, l.start, l.end });

        public class Leauge
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
            public UserData userData { get; set; }
            public UserStats userStats { get; set; }
            [JsonIgnore]
            public long lastloggedin { get; set; }
            public int ID { get; set; }
            public string name { get; set; }
            [JsonIgnore]
            public string hash { get; set; }
            [JsonIgnore]
            public string salt { get; set; }
            [JsonIgnore]
            public string email { get; set; }
        }

        public class UserData
        {
            public int ID { get; set; }
            public int UID { get; set; }
            public int? LID { get; set; }
            public int? HID { get; set; }
            public int bestrank { get; set; }
            public long age { get; set; }
            public int wins { get; set; }
            public int losses { get; set; }
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
