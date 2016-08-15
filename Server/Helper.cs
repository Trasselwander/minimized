using System;

namespace Server
{
    public static class Helper
    {
        public static long GetTimestamp()
        {
            return (long)((DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds);
        }
    }
}

