function performMfa(user, context, callback) {
  const userEnrolledFactors = user.multifactor || [];
  const canPromptMfa = userEnrolledFactors.length > 0;

  //Returning from custom MFA app
  if (context.clientID === '9YpFT6XvFQDwmobcC-YNhpNxCz_aVxDC') { return callback(null, user, context); }
  //Returning from MFA validation
  if (context.protocol === 'redirect-callback') {
    return callback(null, user, context);
  }

  //Trigger custom MFA enrollment
  if (!canPromptMfa) {
    context.redirect = {
      url: configuration.Custom_MFA_URL
    };

    return callback(null, user, context);

  }
  //Trigger Auth0 MFA challenge
  if (canPromptMfa) {
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: false
    };
    return callback(null, user, context);
  }
}
