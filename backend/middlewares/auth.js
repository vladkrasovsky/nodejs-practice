const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Отримати токен з заголовку
    const [tokenType, token] = req.headers.authorization.split(" ");

    // Перевіряємо чи передано токен та чи він є токеном авторизації
    if (token && tokenType === "Bearer") {
      // Розшифровуємо токен
      const decodedData = jwt.verify(token, "pizza");

      // Передаємо далі отримані дані з токену
      req.user = decodedData;
      next();
    }
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: error.message,
    });
  }
};
