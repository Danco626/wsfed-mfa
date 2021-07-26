function performMfa(user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  const userEnrolledFactors = user.multifactor || [];
  const canPromptMfa = userEnrolledFactors.length > 0;
 
  const emailOnly = 'emailMfaOnly' in user;//.app_metadata;
	console.log('email Only' + emailOnly);
  
  //Returning from custom MFA app
  if (context.clientID === '{clientid of custom MFA application }') { return callback(null, user, context); }
  //Returning from MFA validation
  if (context.protocol === 'redirect-callback') {
    return callback(null, user, context);
  }

  //Trigger custom MFA enrollment  
  if (emailOnly && !canPromptMfa) {
    context.redirect = {
      url: 'http://localhost:4000/login'
    };

    return callback(null, user, context);

  }
  //Trigger Auth0 MFA challenge 
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: false
    };
    return callback(null, user, context);
  
}
