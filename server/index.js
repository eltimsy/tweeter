"use strict";
require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const express     = require("express");
const bodyParser  = require("body-parser");
const app         = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

const tweetsApi  = require('./api/tweets');
const db         = require('./lib/db');

app.use(cookieParser());
app.use(session({
  cookieName: 'session',
  secret: 'crazy person',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/logout', (req, res) => {
  req.session.user = null;
  res.end();
});

app.post('/login', (req, res) => {
  req.session.user = req.body.username;
  res.end();
})

app.get('/auth', (req, res) => {
  res.json({username: req.session.user});
})

db.connect((dbInstance) => {
  app.use('/tweets', tweetsApi(dbInstance));
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
