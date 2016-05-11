using Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using static Server.Services.UserService;

namespace Server.Modules
{
    class TimerModule
    {
        public static UserService Users = new UserService();

        private static Timer timer1 = new Timer();
        private static Timer timer2 = new Timer();
        private static Timer timer3 = new Timer();
        private static int CLID1;
        private static int CLID2;
        private static int CLID3;

        public static void initTimers()
        {
            var dt = DateTime.Now;

            dt.AddMinutes(5 - (dt.Minute % 5)); // skapar hel 5 min
            dt.AddSeconds(-dt.Second); // tar bort alla sekunder --> 12:15:00

            double t = dt.Subtract(DateTime.Now).TotalMilliseconds;

            timer1.Interval = t;
            timer1.Elapsed += (sender, e) => giveHat(); // vad som ska hända när den är klar
            timer1.Start(); //starta
        }

        private static void giveHat()
        {
            timer1.Stop();
            timer1.Interval = 1000 * 60 * 5;
            timer1.Start(); //starta

            Users.CreateLeague(new League()
            {
                name = (new Random()).NextDouble() > .5 ? "Eld Tävling" : "Vatten Tävling",
                start = (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds),
                end = (long)((DateTime.UtcNow.AddMinutes(5) - new DateTime(1970, 1, 1)).TotalMilliseconds)
            });
        }


    }
}
