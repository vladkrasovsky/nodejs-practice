const asyncHandler = require("express-async-handler");
const FilmsModel = require("../model/filmsModel");
const FilmsService = require("../services/FilmsService");

class FilmsController {
  add = asyncHandler(async (req, res) => {
    const { title, year } = req.body;
    if (!title || !year) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }
    const film = await FilmsModel.create({ ...req.body });
    if (!film) {
      res.status(400);
      throw new Error("Polamav bazu");
    }
    res.status(201).json({ code: 201, message: "success", data: film });
  });

  getAll = asyncHandler(async (req, res) => {
    const films = await FilmsService.showAll();

    res.status(200).json({
      code: 200,
      message: "success",
      data: films,
      quantity: films.length,
    });
  });

  async getOne(req, res) {}

  async update(req, res) {}

  remove = asyncHandler(async (req, res) => {});
}

module.exports = new FilmsController();
