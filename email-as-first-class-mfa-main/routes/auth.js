var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
const { authorize } = require('passport');

dotenv.config();


//app -redirect to /authorize-> auth0
// app <- code - auth0
// app -POST /oauth/token-> auth0
// app <- access token - auth0

//associate the email factor (user gets an email with OTP)
// app -POST-> auth0 (/mfa/associate)
// app <-OOB code - auth0 


//complete enrollment by validating OTP
//app - POST -> Auth0 (/oauth/token)
// app <- access token - Auth0

//redirect back to rules
// app - (/continue?state=asdsa) -> Auth0



// Perform the login, after login Auth0 will redirect to callback
router.get('/login', function(req, res, next) {
  console.log("request state", req.query.state);
  const redirectState = req.query.state;
  req.session.redirectState = redirectState;
  console.log(req.session.redirectState);
  passport.authenticate('auth0', {
    scope: 'enroll offline_access read:authenticators remove:authenticators openid profile email',
    audience: `https://${process.env.AUTH0_DOMAIN}/mfa/`,
    connection: process.env.AUTH0_CONNECTION,
  })(req, res, (req, res) => {
    res.redirect("/")
  })
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function(req, res, next) {
  passport.authenticate('auth0', function(err, user, info) {
    if (err) {
      console.log("error", err);
      return next(err);
    }
    if (!user) {
      console.log("no user");
      console.log(info)
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

  
  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = router;
