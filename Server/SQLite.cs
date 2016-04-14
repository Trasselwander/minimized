using Mono.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
namespace Server
{
    class SQLite
    {
        static SqliteConnection GetConnection // 
        {
            get
            {
                return new SqliteConnection("Data Source=minimal.db;Version=3");
            }
        }


        static void DropDatabase()
        {

            

        }

        static void CreateDatabase()
        {

            GetConnection.Query(@"CREATE TABLE users (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(20) NOT NULL,
                                    hash CHAR(255) NOT NULL,
                                    salt CHAR(255) NOT NULL,
                                    email CHAR(50))");

            GetConnection.Query(@"CREATE TABLE userdata (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INT NOT NULL,
                                    rank INT NOT NULL,
                                    score INT NOT NULL,
                                    exp INT NOT NULL)");

            GetConnection.Query(@"CREATE TABLE userstats (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INT NOT NULL,
                                    life INT NOT NULL,
                                    speed INT NOT NULL,
                                    physicalattack INT NOT NULL,
                                    physicaldefence INT NOT NULL,
                                    magicattack INT NOT NULL,
                                    magicdefence INT NOT NULL,
                                    hat CHAR(255))");


        }

    }
}
