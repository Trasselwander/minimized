using Mono.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Server.Services;

namespace Server
{
    class SQLite
    {
        public static SqliteConnection GetConnection() => new SqliteConnection("Data Source=minimal.db;Version=3");

        public static void InitDatabase()
        {

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS users (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(20) NOT NULL,
                                    hash CHAR(255) NOT NULL,
                                    salt CHAR(255) NOT NULL,
                                    lastloggedin INTEGER NOT NULL,
                                    LID INTEGER,
                                    HID INTEGER,
                                    bestrank INTEGER NOT NULL,
                                    age INTEGER NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userstats (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INTEGER NOT NULL,
                                    LID INTEGER NOT NULL,
                                    life INTEGER NOT NULL DEFAULT 1,
                                    speed INTEGER NOT NULL DEFAULT 1,
                                    physicalattack INTEGER NOT NULL DEFAULT 1,
                                    physicaldefence INTEGER NOT NULL DEFAULT 1,
                                    magicattack INTEGER NOT NULL DEFAULT 1,
                                    magicdefence INTEGER NOT NULL DEFAULT 1,
                                    
                                    level INTEGER NOT NULL DEFAULT 1,
                                    score INTEGER NOT NULL DEFAULT 0,
                                    exp INTEGER NOT NULL DEFAULT 0,
                                    bestrank INTEGER NOT NULL,
                                    skillpoints INTEGER DEFAULT 4)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userhats (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INTEGER NOT NULL,
                                    HID INTEGER NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS leagues (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    HID INTEGER DEFAULT -1,
                                    name CHAR(50) NOT NULL,
                                    tag CHAR(12) DEFAULT NULL,
                                    start INTEGER NOT NULL,
                                    end INTEGER NOT NULL)");

            (new UserService()).CreateLeague(new UserService.League() {
                name = (new Random()).NextDouble() > .5 ? "ADAM" : "DANIEL",
                start = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds),
                end = (long)((DateTime.UtcNow.AddHours(5) - new DateTime(1970, 1, 1)).TotalMilliseconds)
            });

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS hats (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(50) NOT NULL,
                                    url CHAR(70) NOT NULL)");


            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS attacks (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    LID INTEGER NOT NULL,
                                    AID INTEGER NOT NULL,
                                    DID INTEGER NOT NULL,
                                    AHP INTEGER NOT NULL,
                                    DHP INTEGER NOT NULL,
                                    DDUP INTEGER NOT NULL DEFAULT 0,
                                    DAUP INTEGER NOT NULL DEFAULT 0,
                                    start INTEGER NOT NULL)"); // AID = attacker id, DID = defender id (both derived from UID)

        }

    }
}
