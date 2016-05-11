using Nancy;
using Nancy.Bootstrapper;
using Nancy.Conventions;
using Nancy.Responses;
using Nancy.TinyIoc;
using Server.Modules;

namespace Server
{
    public class CustomBootstraper : DefaultNancyBootstrapper
    {
        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
        {
            pipelines.OnError += (ctx, exception) =>
            {
                if (exception is HttpErrorException)
                {
                    HttpErrorException err = exception as HttpErrorException;
                    ctx.Response = HelperModule.CreateResponse(err.Status, err.Message);

                    ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                        .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                        .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type, Authorization");

                    return ctx.Response;
                }

                return null;
            };

            pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
            {
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                                .WithHeader("Access-Control-Allow-Methods", "POST,GET")
                                .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type, Authorization");
            });

            base.RequestStartup(container, pipelines, context);
        }
    }
}
