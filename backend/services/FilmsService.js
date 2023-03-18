const FilmsModel = require("../model/filmsModel");

class FilmsService {
  async showAll() {
    const films = await FilmsModel.find({});

    if (!films) {
      res.status(400);
      throw new Error("Nemogu, ya ustal");
    }

    return films;
  }
}

module.exports = new FilmsService();
