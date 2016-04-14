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
                return new SqliteConnection(/* Connection string here */);
            }
        }


        static void DropDatabase()
        {

            

        }

        static void CreateDatabase()
        {



            // USER --- > 
            // USER_DATA --> 
        }

    }
}
