using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Modules
{
    public class HelperModule : NancyModule
    {
        public HelperModule(string path) : base(path) { }
        public HelperModule() { }


        public static Response CreateResponse(HttpStatusCode status)
        {
            return new Response() { StatusCode = status };
        }
    }
}
