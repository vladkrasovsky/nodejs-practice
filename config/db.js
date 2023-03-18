const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URI);
    console.log(
      `MongoDB is connected, DB name: ${db.connection.name}, on port ${db.connection.port}, on host ${db.connection.host}`
        .green.italic.bold
    );
  } catch (error) {
    console.log(error.message.red.italic.bold);
    process.exit(1);
  }
};


module.exports = connectDb;
