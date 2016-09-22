"use strict";
require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const express     = require("express");
const bodyParser  = require("body-parser");
const app         = express();
const cookieParser = require('cookie-parser');

const tweetsApi  = require('./api/tweets');
const db         = require('./lib/db');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/');
});

db.connect((dbInstance) => {
  app.use('/tweets', tweetsApi(dbInstance));
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
