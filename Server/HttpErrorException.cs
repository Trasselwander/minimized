using Nancy;
using System;

namespace Server
{
    public class HttpErrorException : Exception
    {
        public HttpErrorException(HttpStatusCode status, string message)
            : base(message)
        {
            Message = message;
            Status = status;
        }
        public HttpErrorException(HttpStatusCode status, string message, Exception inner)
            : base(message, inner)
        {
            Message = message;
            Status = status;
        }

        public string Message { get; set; }
        public HttpStatusCode Status { get; set; }
    }
}