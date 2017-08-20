import express from 'express';

// [START setup]
import passport from 'passport';
import passportGoogleOauth2 from 'passport-google-oauth20';

const GoogleStrategy = passportGoogleOauth2.Strategy;

function extractProfile(profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl,
  };
}

// Configure the Google strategy for use by Passport.js.
//
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback',
  accessType: 'offline',
}, (accessToken, refreshToken, profile, cb) => {
  // Extract the minimal profile information we need from the profile object
  // provided by Google
  cb(null, extractProfile(profile));
}));

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  console.log('deserializeUser', obj);
  done(null, obj);
});
// [END setup]

const router = express.Router();

router.get('/login',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

export default router;