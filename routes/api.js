import express from 'express';
import fetch from 'node-fetch';
import refresh from 'passport-oauth2-refresh';

const router = express.Router();

router.get('/tasklists', (req, res) => {
  const user = req.user;
  const makeRequest = () => {
    console.log('/tasklists', user.accessToken);
    fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists?access_token=${user.accessToken}`)
      .then((response) => {
        if (response.status === 401) {
          console.log('response status 401. Retry');
          // Access token expired (or is invalid).
          // Try to fetch a new one.
          refresh.requestNewAccessToken('google', user.refreshToken, (err, accessToken) => {
            // TODO: Error handling
            console.log('new access_token', accessToken);

            // Save the new accessToken
            user.accessToken = accessToken;
            user.save().then(() => {
              makeRequest();
            });
          });
        }

        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return res.json(data.items);
      });
  };

  return makeRequest();
});

export default router;
