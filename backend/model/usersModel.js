const { model, Schema } = require("mongoose");

const usersSchema = Schema({
  email: {
    type: String,
    required: [true, "DB: email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "DB: password is required"],
  },
  token: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: "Unknown",
  },
  userFriendlyId: {
    type: String,
    default: "Unknown",
  },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", usersSchema);
