# 01-Login

## Running the Sample

Install the dependencies.

```bash
npm install
```

Rename `.env.example` to `.env` and replace the values for `AUTH0_CLIENT_ID`, `AUTH0_DOMAIN`, and `AUTH0_CLIENT_SECRET` with your Auth0 credentials. If you don't yet have an Auth0 account, [sign up](https://auth0.com/signup) for free.
Add `AUTH0_CALLBACK_URL` to .env and this value refers to the callback of the custom MFA app.

```bash
# copy configuration and replace with your own
cp .env.example .env
```

If you're using a hosting provider that uses a proxy in front of Node.js, comment in the `trust proxy` configuration in [app.js](https://github.com/auth0-samples/auth0-nodejs-webapp-sample/blob/812bb41fa655a1178f6a33ba54b0aee2397b1917/01-Login/app.js#L63-L70). This is a [`express-session` configuration setting](https://www.npmjs.com/package/express-session#cookiesecure) that allows for trusting this first proxy.

Run the app.

```bash
npm start
```

The app will be served at `localhost:3000`, but for redirect rules to work, this app has to be hosted on a service like heroku.

## Deploy the sample Rule

Sample Rule to redirect is under rules folder and needs to be added to your tenant.

## What does the app do?

- The client application initiates a call to Auth0 for authentication. 
- The rule detects the user doesn't have MFA enrollments and redirects to custom MFA app that needs to be hosted on a service
- The custom MFA app can present all MFA options (including email as the first class MFA option)
- The custom MFA enrolls the user's email and any other MFA factors like SMS. 
- After the enrollment is complete, the user will be redirected to the Rules. 
- Rules will finally redirect the user to client application. 
- All subsquent MFA challenge will happen on Auth0 New UL (If user enrolled only with Email MFA, New UL MFA challenge will be only Email MFA)