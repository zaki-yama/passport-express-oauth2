import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/tasklists', (req, res) => {
  console.log('/tasklists', req.user);
  fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists?access_token=${req.user.accessToken}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return res.json(data.items);
    });
});

export default router;
