using Nancy;
using Nancy.Bootstrapper;
using Nancy.Conventions;
using Nancy.TinyIoc;
using Server.Modules;

namespace Server
{
    public class CustomBootstraper : DefaultNancyBootstrapper
    {
        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
        {
            pipelines.OnError.AddItemToEndOfPipeline((ctx, exception) =>
            {
                if (exception is HttpErrorException)
                    return HelperModule.CreateResponse((exception as HttpErrorException).Status, (exception as HttpErrorException).Message);

                return null;
            });
        }
    }
}
