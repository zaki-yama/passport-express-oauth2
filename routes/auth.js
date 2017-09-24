import express from 'express';

// [START setup]
import passport from 'passport';
import passportGoogleOauth2 from 'passport-google-oauth20';

import User from '../models/user';

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
  // FIXME: Enable to switch local & production environment.
  callbackURL: 'http://localhost:8080/auth/google/callback',
  accessType: 'offline',
}, (accessToken, refreshToken, profile, done) => {
  // Extract the minimal profile information we need from the profile object
  // provided by Google
  User.findByIdAndUpdate(profile.id, extractProfile(profile), {
    upsert: true,
    new: true,
  }, (err, user) => {
    console.log(err, user);
    return done(err, user);
  });
}));

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);
  User.findById(id, (err, user) => {
    if (err || !user) {
      console.log('Cannot find user', id);
      return done(err);
    }
    console.log('Found user', user);
    done(null, user);
  });
});
// [END setup]

const router = express.Router();

router.get('/login',
  passport.authenticate('google', { scope: [
    'email',
    'profile',
    'https://www.googleapis.com/auth/tasks',
  ] }),
);

router.get(
  // OAuth 2 callback url. Use this url to configure your OAuth client in the
  // Google Developers console
  '/google/callback',

  // Finish OAuth 2 flow using Passport.js
  passport.authenticate('google'),

  // Redirect back to the original page, if any
  (req, res) => {
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    res.redirect(redirect);
  },
);

export default router;
