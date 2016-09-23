"use strict";

const User    = require("../lib/user-helper")
const express = require('express');
const tweets  = express.Router();

module.exports = function(db) {

  tweets.get("/", function(req, res) {
    let tweets = db.collection("tweets").find().sort({"created_at": -1});
    tweets.toArray((err, results) => {
      // simulate delay
      setTimeout(() => {
        return res.json(results);
      }, 300);
    });
  });

  tweets.get("/my", function(req, res) {
    let user = req.cookies.username;
    let tweets = db.collection("tweets").find({ "user.name": `${user} ${user}` }).sort({"created_at": -1});
    tweets.toArray((err, results) => {
      // simulate delay
      setTimeout(() => {
        return res.json(results);
      }, 300);
    });
  });

  tweets.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400);
      return res.send("{'error': 'invalid request'}\n");
    }
    const user = User.generateUser(req.cookies.username);
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };
    db.collection("tweets").insertOne(tweet, (err, result) => {
      res.json(result);
    });
  });

  return tweets;

}
