using System;
using System.Collections.Generic;
using System.Timers;
using static Server.Services.UserService;

namespace Server.Services
{
    class TimerService
    {
        public static List<TimerService> Timers = new List<TimerService>();

        private static UserService Users = new UserService();
        private static Timer timer;
        private static int currentLID;

        public List<long> PriceIDs = new List<long>(); // hats

        private double ms;

        public static void InitTimers()
        {
            KeyValuePair<long, bool>[] timers =
            {
                new KeyValuePair<long, bool>(5 * 60 * 1000, true),
                new KeyValuePair<long, bool>(30 * 60 * 1000, true),
                new KeyValuePair<long, bool>(6 * 60 * 60 * 1000, false),
            };

            for (int i = 0; i < timers.Length; i++)
            {
                TimerService t = new TimerService(timers[i].Key, timers[i].Value);
                Timers.Add(t);
            }
        }

        public TimerService(TimeSpan time, bool skipfirst)
        {
            Init(time.TotalMilliseconds, skipfirst);
        }

        public TimerService(double ms, bool skipfirst)
        {
            Init(ms, skipfirst);
        }

        private double getRemainingMs(double ms)
        {
            return ms - (new TimeSpan(DateTime.Now.Ticks).TotalMilliseconds % ms);
        }

        public void Init(double mss, bool skipfirst = false)
        {
            ms = mss;
            currentLID = -1;

            if (!skipfirst)
                restartLeaugeAndAward();
            else
                startTimer();
        }

        private void startTimer()
        {
            timer = new Timer(); // to reset timer.Elapsed
            timer.Elapsed += (sender, e) => restartLeaugeAndAward();
            timer.Interval = getRemainingMs(ms);
            timer.Start();
        }

        private void restartLeaugeAndAward()
        {
            startTimer();

            string name = (new Random()).NextDouble() > .5 ? "Eld Tävling" : "Vatten Tävling";

            long start = Helper.GetTimestamp(),
                end = Helper.GetTimestamp() + (long)getRemainingMs(ms);

            Users.CreateLeague(new League()
            {
                name = name,
                start = start,
                end = end,
                tag = ms / 1000 + ""
            });

            if (currentLID != -1)
            {
                // AWARD THE WINER OF LAST LEAUGE HERE...
                League lg = Users.GetUserLeague(currentLID);

                // give player hat with lg.HID id
            }

            currentLID = Users.GetLeague(name, start, end).ID;
        }

        public void Stop()
        {
            timer.Stop();
        }

        public void Start()
        {
            timer.Interval = getRemainingMs(ms);
            timer.Start();
        }
    }
}
