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
        public static SqliteConnection GetConnection()
           => new SqliteConnection("Data Source=minimal.db;Version=3"); 


        public static void InitDatabase()
        {

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS users (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(20) NOT NULL,
                                    hash CHAR(255) NOT NULL,
                                    salt CHAR(255) NOT NULL,
                                    email CHAR(50))");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userdata (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INT NOT NULL,
                                    LID INT NOT NULL,
                                    HID INT NOT NULL,
                                    rank INT NOT NULL,
                                    bestrank INT NOT NULL,
                                    score INT NOT NULL,
                                    exp INT NOT NULL,
                                    hat CHAR(255),
                                    age INT NOT NULL,
                                    wins INT,
                                    losses INT,
                                    level INT NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userstats (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INT NOT NULL,
                                    life INT NOT NULL,
                                    speed INT NOT NULL,
                                    physicalattack INT NOT NULL,
                                    physicaldefence INT NOT NULL,
                                    magicattack INT NOT NULL,
                                    magicdefence INT NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userhats (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INT NOT NULL,
                                    HID INT NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS leagues (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    start INT NOT NULL,
                                    duration INT NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS hats (
                                    ID INT PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(50) NOT NULL,
                                    url CHAR(70) NOT NULL)");
        }

    }
}
