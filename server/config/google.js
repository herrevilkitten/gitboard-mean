module.expors = {
    clientId: process.env.GITBOARD_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GITBOARD_GOOGLE_CLIENT_SECRET,
    callbackUrl: 'http://localhost:8080/auth/google/callback'
};