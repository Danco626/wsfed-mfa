using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using SampleMvcApp.Support;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.WsFederation;

namespace SampleMvcApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureSameSiteNoneCookies();
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = WsFederationDefaults.AuthenticationScheme;
            })
           .AddWsFederation("Auth0", options =>
           {

               //options.ClaimsIssuer = "Auth0";
                // MetadataAddress represents the Active Directory instance used to authenticate users.
                options.MetadataAddress = $"https://{Configuration["Auth0:Domain"]}/wsfed/nMaMazN9FFRqEcbqUgPI7oExeDtVVjG3/FederationMetadata/2007-06/FederationMetadata.xml";

               // Wtrealm is the app's identifier. This is configured in the ws-fed addon in Auth0
               options.Wtrealm = "urn:1";
               options.SaveTokens = true;
               options.Events = new WsFederationEvents
               {
                   OnRedirectToIdentityProvider = (context) => {
                       context.ProtocolMessage.SetParameter("whr", Configuration["Auth0:Connection"].ToString());                       
                       return Task.CompletedTask;
                   },
                   OnRemoteSignOut = (context) => {
                       var logoutUri = $"https://{Configuration["Auth0:Domain"]}/v2/logout?client_id={Configuration["Auth0:ClientId"]}";
                       context.Response.Redirect(logoutUri);
                       return Task.CompletedTask;
                   }
                   
                   // handle the logout redirection 
                  
               };
           }).AddCookie();          

            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
