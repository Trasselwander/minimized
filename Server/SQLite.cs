using Mono.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class SQLite
    {
        static SqliteConnection GetConnection // 
        {
            get
            {
                return new SqliteConnection(/* Connection string here */);
            }
        }
    }
}
