using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace Server.Services
{
    public class UserService
    {
        public User GetUser(string name)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE name=@name", new { name = name }).FirstOrDefault();

        public User GetUserByEmail(string email)
            => SQLite.GetConnection().Query<User>("SELECT * FROM users WHERE email=@email", new { email = email }).FirstOrDefault();


        public UserData GetUserData(int uid)
            => SQLite.GetConnection().Query<UserData>("SELECT * FROM usersdata WHERE UID=@uid", new { uid = uid }).FirstOrDefault();

        public UserData GetUserData(string name)
            => SQLite.GetConnection().Query<UserData>("SELECT * FROM usersdata INNER JOIN users ON userdata.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();


        public UserStats GetUserStats(int uid)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM usersstats WHERE UID=@uid", new { uid = uid }).FirstOrDefault();

        public UserStats GetUserStats(string name)
            => SQLite.GetConnection().Query<UserStats>("SELECT * FROM userstats INNER JOIN users ON userstats.UID=users.ID AND users.name=@name", new { name = name }).FirstOrDefault();



        public List<User> GetUsersFromRank(int rank)
        {
            List<User> uses = null;
            SQLite.GetConnection().Query<User, UserStats, DBNull>("SELECT * FROM users INNER JOIN userstats ON userstats.UID=users.ID AND abs(@rank - user.rank) <= 3", (users, userstats) =>
               {
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
            int i = SQLite.GetConnection().Query<int>("INSERT INTO users (name, email, hash, salt)VALUES(@name, @email, @hash, @salt)", new { name = u.name, email = u.email, hash = u.hash, salt = u.salt }).FirstOrDefault();



            return u;
        }

        public class User
        {
            public UserData userData { get; set; }
            public UserStats userStats { get; set; }
            public int lastloggedin { get; set; }
            public int ID { get; set; }
            public string name { get; set; }
            public string hash { get; set; }
            public string salt { get; set; }
            public string email { get; set; }
        }

        public class UserData
        {
            public int ID { get; set; }
            public int UID { get; set; }
            public int LID { get; set; }
            public int HID { get; set; }
            public int rank { get; set; }
            public int bestrank { get; set; }
            public int score { get; set; }
            public int exp { get; set; }
            public string hat { get; set; }
            public long age { get; set; }
            public int wins { get; set; }
            public int losses { get; set; }
            public int level { get; set; }
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
