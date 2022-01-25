const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const config = require('../config');

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(express.json());
app.use(morgan('dev'));

app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`);
});
