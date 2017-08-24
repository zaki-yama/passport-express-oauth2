import express from 'express';
import session from 'express-session';
import path from 'path';
import passport from 'passport';

import auth from './routes/auth';

const app = express();
const port = process.env.PORT || 8080;

/* [START express setting] */
if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.dev.babel').default;
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
}

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
}));
/* [END express setting] */


/* [START passport setting] */
app.use(passport.initialize());
app.use(passport.session());
/* [END passport setting] */

// Routing
app.use('/auth', auth);

// Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// Application Root
app.get('/', (req, res) => {
  console.log('user', req.user);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
