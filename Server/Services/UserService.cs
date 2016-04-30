﻿using System;
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

        public User GetUserByEmail(string email)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE email=@email", new { email = email }).FirstOrDefault();

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

        public void CreateLeague(League l)
            => SQLite.GetConnection().Query("INSERT INTO leagues (name, start, end) VALUES (@name, @start, @end)", new { l.name, l.start, l.end });

        public void SetScore(User u) // Do not use this function.
            => SQLite.GetConnection().Query("UPDATE userstats SET score=@score WHERE userstats.UID = @uid AND userstats.LID = @lid", new { score = u.userStats.score, uid = u.ID, lid = u.LID });

        public List<User> GetCloseUsersByScore(User u)
            => u.userStats == null ? null : SQLite.GetConnection().Query<User>(@"SELECT *, (abs(userstats.score - @score)) as absscore FROM userstats INNER JOIN users ON users.LID = @lid AND users.ID = userstats.UID AND NOT users.ID = @uid ORDER BY absscore LIMIT 10", new { lid = u.LID, score = u.userStats.score, uid = u.ID }).ToList();

        public List<User> GetTop10ByLeauge(User u)
            => u.LID == null ? null : GetTop10ByLeauge((int)u.LID);

        public List<User> GetTopByLeauge(User u)
            => u.LID == null ? null : GetTopByLeauge((int)u.LID);

        public List<User> GetTopByLeauge(int lid)
            => SQLite.GetConnection().Query(@"SELECT * FROM users INNER JOIN userstats ON users.LID = @lid AND userstats.LID = @lid AND users.ID = userstats.UID ORDER BY userstats.score", (User user, UserStats stats) => { user.userStats = stats; return user; },new { lid = lid }).ToList();

        public List<User> GetTop10ByLeauge(int lid)
            => SQLite.GetConnection().Query(@"SELECT * FROM users INNER JOIN userstats ON users.LID = @lid AND userstats.LID = @lid AND users.ID = userstats.UID ORDER BY userstats.score LIMIT 10", (User user, UserStats stats) => {
                user.userStats = stats; return user; }, new { lid = lid }).ToList();

        public void IncrementStat(string stat, User u)
            => SQLite.GetConnection().Query("UPDATE userstats SET @stat += 1 WHERE userstats.UID = @uid AND userstats.LID = @lid", new { stat = stat, uid = u.ID, lid = u.LID });

        public void UpdateLastLoggedIn(User u)
            => SQLite.GetConnection().Query("UPDATE users SET lastloggedin=@time WHERE users.ID = @uid", new { uid = u.ID, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });


        public User CreateUser(string name, string hash, string email)
        {
            User u = new User() { name = name, hash = hash, email = email };

            if (GetUser(name) != null) throw new HttpErrorException(Nancy.HttpStatusCode.BadRequest, "Username already in use.");

            CryptoService.HashAndSavePassword(hash, u);
            SQLite.GetConnection().QueryMultiple(@"INSERT INTO users (name, email, hash, salt, lastloggedin, bestrank, age) SELECT @name as name, @email as email, @hash as hash, @salt as salt, @time as lastloggedin, (SELECT COUNT(*) FROM users) AS bestrank, @time AS age; 
                                                   INSERT INTO userstats (UID, bestrank)
	                                                   SELECT (SELECT ID FROM users WHERE users.name = @name) AS UID, COUNT(*) AS bestrank FROM users;"
                                                   , new { name = u.name, email = u.email, hash = u.hash, salt = u.salt, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

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
                var d = SQLite.GetConnection().Query<League>(@"SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                var data = SQLite.GetConnection().Query<League>(@"SELECT 
                                                                    SUM(userstats.life) AS life, 
                                                                    SUM(userstats.speed) AS speed,
                                                                    SUM(userstats.physicalattack) AS physicalattack, 
                                                                    SUM(userstats.physicaldefence) AS physicaldefence, 
                                                                    SUM(userstats.magicattack) AS magicattack, 
                                                                    SUM(userstats.magicdefence) AS magicdefence
                                                                 FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.LID=@lid", new { lid = l.ID }).FirstOrDefault();

                l.leader = SQLite.GetConnection().Query<string>(@"SELECT name FROM users INNER JOIN userstats ON users.ID=userstats.UID AND users.LID=@lid ORDER BY SCORE LIMIT 1", new { lid = l.ID }).FirstOrDefault();

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
