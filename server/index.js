const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const db = require('../db');

const app = express();
const config = require('../config');

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(express.json());
app.use(morgan('dev'));

app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

app.get('/db/settings', (req, res) => {
  const { sessionID } = req;
  console.log(sessionID);
  db.retrieveSettings(sessionID)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post('/db/settings', (req, res) => {
  const { sessionID } = req;
  const settings = req.body;
  db.updateOrAddSettings(sessionID, settings)
    .then((response) => {
      console.log('post response: ', response);
      res.status(201).json(response);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/api/xkcd/:comicNumber', (req, res) => {
  const { comicNumber } = req.params;
  axios.get(`https://xkcd.com/${comicNumber}/info.0.json`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/api/catapi', (req, res) => {
  const url = 'https://api.thecatapi.com/v1/images/search';
  const headers = { headers: { 'x-api-key': config.catAPI } };
  axios.get(url, headers)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/api/dogapi', (req, res) => {
  axios.get('https://dog.ceo/api/breeds/image/random')
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/api/programming-memes', (req, res) => {
  const headers = {
    headers: {
      'x-rapidapi-host': 'programming-memes-images.p.rapidapi.com',
      'x-rapidapi-key': config.rapidAPI,
    },
  };
  const url = 'https://programming-memes-images.p.rapidapi.com/v1/memes';
  axios.get(url, headers)
    .then((response) => {
      res.status(200).json(response.data);
    }).catch((err) => {
      console.error(err);
    });
});

app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`);
});
