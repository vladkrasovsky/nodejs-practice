const filmsController = require("../controllers/FilmsController");

// http://localhost:5000/api/v1/films

const express = require("express");

const filmsRouter = express.Router();

const rolesMiddleware = require("../middlewares/rolesMiddleware");
const auth = require("../middlewares/auth");

//Add film
filmsRouter.post(
  "/films",
  (req, res, next) => {
    console.log("Joi works");
    next();
  },
  filmsController.add
);

//Get all films
filmsRouter.get(
  "/films",
  auth,
  rolesMiddleware(["ADMIN", "MODERATOR", "USER"]),
  filmsController.getAll
);

//Get one film
filmsRouter.get("/films/:id", filmsController.getOne);

//Update film
filmsRouter.put("/films/:id", filmsController.update);

//Remove film
filmsRouter.delete("/films/:id", filmsController.remove);

module.exports = filmsRouter;
