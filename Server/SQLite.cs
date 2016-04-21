﻿using Mono.Data.Sqlite;
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
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(20) NOT NULL,
                                    hash CHAR(255) NOT NULL,
                                    salt CHAR(255) NOT NULL,
                                    lastloggedin INTEGER NOT NULL,
                                    email CHAR(50))");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userdata (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INTEGER NOT NULL,
                                    LID INTEGER,
                                    HID INTEGER,
                                    rank INTEGER NOT NULL,
                                    bestrank INTEGER NOT NULL,
                                    score INTEGER NOT NULL DEFAULT 0,
                                    exp INTEGER NOT NULL DEFAULT 0,
                                    age INTEGER NOT NULL,
                                    wins INTEGER NOT NULL DEFAULT 0,
                                    losses INTEGER NOT NULL DEFAULT 0,
                                    level INTEGER NOT NULL DEFAULT 1)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userstats (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INTEGER NOT NULL DEFAULT 1,
                                    life INTEGER NOT NULL DEFAULT 1,
                                    speed INTEGER NOT NULL DEFAULT 1,
                                    physicalattack INTEGER NOT NULL DEFAULT 1,
                                    physicaldefence INTEGER NOT NULL DEFAULT 1,
                                    magicattack INTEGER NOT NULL DEFAULT 1,
                                    magicdefence INTEGER NOT NULL DEFAULT 1)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS userhats (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    UID INTEGER NOT NULL,
                                    HID INTEGER NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS leagues (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    start INTEGER NOT NULL,
                                    duration INTEGER NOT NULL)");

            GetConnection().Query(@"CREATE TABLE IF NOT EXISTS hats (
                                    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                    name CHAR(50) NOT NULL,
                                    url CHAR(70) NOT NULL)");
        }

    }
}
