# Client Application  
This is the app where the user will log in. To login via OIDC, use the *OidcClient* and for Ws-Fed, use the *WsFedClient* client app.  
 
## OidcClient (nodeJS)  
**Auth0 Configuration**  
- Callback URL: http://localhost:3000/callback  

**App Configuration**  
1. Update auth_config.json with the corresponding app settings  
2. In terminal execute npm install, then npm start    

## WsFedClient (dotnet code)  
**Auth0 Configuration**    
- Enable the WS-Fed addon   
- Application Callback URL: http://localhost:3000/signin-wsfed  
- Realm urn:1  

**App Configuration**  
1. Update sample_appsettings.json with the corresponding app settings  
2. Rename sample_appsettings.json to appsettings.json
3. To run: In terminal execute dotnet build, then dotnet run

# MFA Application  
Custom MFA app for enrolling in email MFA
## email-as-first-class-mfa-main (nodeJS)  
**Auth0 Configuration**  
- Callback URL: http://localhost:4000/callback  
- Under Applications > Select app > Advanced Settings > Grant Types, enable MFA

**App Configuration**  
1. Update .sample-env with the corresponding app settings  
2. Rename .sample-env to .env
3. In terminal execute npm install, then npm start    

# Rule  
1. Create a new rule with the contents of ./email-as-first-class-mfa-main/rules/redirect-rule.js  
2. On line 10, replace *'{clientid of custom MFA application }'* with the client id of the email-as-first-class-mfa-main application  
 


