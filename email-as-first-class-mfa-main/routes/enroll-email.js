var express = require('express');
var secured = require('../lib/middleware/secured');
var axios = require('axios');
var qs = require('qs');
var router = express.Router();

/* GET user profile. */
router.get('/enroll-email', secured(), function(req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  console.log(userProfile);
  axios({
    url: "https://danco-mfa.auth0.com/mfa/associate",
    method: 'post',
    data: {
      "authenticator_types": ["oob"],
      "oob_channels": ["email"],
      "email": userProfile.emails[0].value
    },
    headers: {
      Authorization: `Bearer ${userProfile.accessToken}`
    }
  }).then(response => {
    console.log(response.data);
    req.session.oob_code = response.data.oob_code;
    res.render('mfa', {
      userProfile,
      title: 'MFA Page'
    });
  }).catch(e => {
    console.log(e);
  })

});

router.post('/mfa', secured(), (req, res, next) => {
  console.log("OOB", req.session.oob_code, req.body)
  let post_data = {
    mfa_token: req.user.accessToken,
    oob_code: req.session.oob_code,
    binding_code: req.body.mfa_code,
    grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    client_id: process.env.AUTH0_CLIENT_ID
  }
  axios({
    url: 'https://danco-mfa.auth0.com/oauth/token',
    method: 'post',
    data: qs.stringify(post_data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then(response => {
    console.log(response.data);
    //res.send("Done");
    res.writeHead(301, {
      Location: 'https://' + process.env.AUTH0_DOMAIN + '/continue' + '?state=' + req.session.redirectState
    });
    res.end();

  }).catch(e => {
    console.log(e);
    res.send("Failed")
  })
})

module.exports = router;
