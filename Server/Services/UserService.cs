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
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM usersstats WHERE UID=@uid", new { uid = uid }).FirstOrDefault();

        public UserStats GetUserStats(string name)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();



        public List<User> GetUsersFromRank(int rank)
        {
            List<User> uses = new List<User>();
            SQLite.GetConnection().Query<User, UserData, UserStats, DBNull>("SELECT * FROM users INNER JOIN userdata ON userdata.UID=users.ID AND abs(@rank - userdata.rank) <= 3 INNER JOIN userstats ON userstats.UID=users.ID", (users, userdata, userstats) =>
               {
                   users.userData = userdata;
                   users.userStats = userstats;
                   uses.Add(users);

                   return null;
               }, new { rank = rank }).FirstOrDefault();
            return uses;
        }

        public User CreateUser(string name, string hash, string email)
        {
            User u = new User() { name = name, hash = hash, email = email };
            CryptoService.HashAndSavePassword(hash, u);
            SQLite.GetConnection().QueryMultiple(@"INSERT INTO users (name, email, hash, salt, lastloggedin)VALUES(@name, @email, @hash, @salt, @time); 
                                                   INSERT INTO userstats (UID) SELECT ID AS UID FROM users WHERE users.name = @name;
                                                   INSERT INTO userdata (UID, rank, bestrank, age) 
                                                   SELECT ID AS UID, 
	                                                   (SELECT COUNT(*) FROM users) AS rank, 
	                                                   (SELECT COUNT(*) FROM users) AS bestrank, 
	                                                   @time as time 
                                                   FROM users WHERE users.name = @name;", new { name = u.name, email = u.email, hash = u.hash, salt = u.salt, time = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds) });

            return u;
        }

        public class User
        {
            public UserData userData { get; set; }
            public UserStats userStats { get; set; }
            [JsonIgnore]
            public int lastloggedin { get; set; }
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
            public int rank { get; set; }
            public int bestrank { get; set; }
            public int score { get; set; }
            public int exp { get; set; }
            public long age { get; set; }
            public int wins { get; set; }
            public int losses { get; set; }
            public int level { get; set; }
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
        }
    }
}
