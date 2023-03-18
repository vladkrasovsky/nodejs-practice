const UsersModel = require("../model/usersModel");

module.exports = (rolesArray) => {
  return async function (req, res, next) {
    try {
      const user = await UsersModel.findById(req.user.id);

      let hasRole = false;

      user.roles.forEach((role) => {
        if (rolesArray.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        res.status(403).json({
          code: 403,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      res.status(401).json({
        code: 401,
        message: "Not authorized",
      });
    }
  };
};
