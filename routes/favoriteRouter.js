const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user._id);
    console.log("Some text here");
    Favorites.findOne({ author: req.user._id })
      .populate("author")
      .populate("favorites")
      .then(
        favorites => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ authpr: req.user._id })
      .then(
        favorite => {
          console.log(req.user._id);
          console.log(favorite);
          if (favorite) {
            req.body.author = req.user._id;
            console.log(favorite);
            favorite.favorites.push(req.body);
            favorites
              .save()
              .then(
                favorites => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorites);
                },
                err => next(err)
              )
              .catch(err => next(err));
          } else {
            console.log("created");
            Favorites.create({ user: req.user._id, favorites: req.body })
              .then(
                favorite => {
                  console.log("Favorite Created ", favorite);
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                },
                err => next(err)
              )
              .catch(err => next(err));
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /favorites");
    }
  )
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ author: req.user._id })
      .then(
        user => {
          user.favorites.remove();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ author: req.user._id })
      .populate("comments.author")
      .populate("favorites")
      .then(
        dish => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ authpr: req.user._id })
      .then(
        favorite => {
          if (
            favorite.favorites
              .id(req.params.favoriteId)
              ._id.equals(req.body._id)
          ) {
            err = new Error("This favorite already exists!");
            err.status = 403;
            return next(err);
          } else {
            favorite.favorites.push(req.body);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /favorites");
    }
  )
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ authpr: req.user._id })
      .then(
        favorite => {
          favorite.favorites.id(req.params.favoriteId).remove();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = favoriteRouter;
