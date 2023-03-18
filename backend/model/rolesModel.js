const { model, Schema } = require("mongoose");

const rolesSchema = Schema({
  value: {
    type: String,
    default: "USER",
    unique: true,
  },
});

module.exports = model("Role", rolesSchema);
