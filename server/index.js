const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const path = require('path');

const app = express();
const config = require('../config');

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(express.json());
app.use(morgan('dev'));

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
  const headers = { headers: { 'x-api-key': config.catAPI } };
  axios.get('https://api.thecatapi.com/v1/images/search', headers)
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
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`);
});
