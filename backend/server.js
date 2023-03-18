const asyncHandler = require("express-async-handler");

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDb = require("../config/db");
const configPath = path.join(__dirname, "..", "config", ".env");
dotenv.config({ path: configPath });

const RolesModel = require("./model/rolesModel");
const UsersModel = require("./model/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");

const generateToken = (data) => {
  const payload = { ...data };
  return jwt.sign(payload, "pizza", { expiresIn: "8h" });
};

require("colors");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// set routes
app.use("/api/v1", require("./routes/filmsRoutes"));

// registration - зберігання нового користувача в базу даних
app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // отримуємо дані від користувача
    const { email, password } = req.body;

    // контролерна валідація даних
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    // шукаємо користувача в базі даних
    const candidate = await UsersModel.findOne({ email });

    // якщо знайшли, такий користувач вже є
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }

    // якщо немає, хешуємо пароль
    const hashPassword = bcrypt.hashSync(password, 5);

    // зберігаємо користувача
    const userRole = await RolesModel.findOne({ value: "USER" });

    const user = await UsersModel.create({
      ...req.body,
      password: hashPassword,
      roles: [userRole.value],
    });

    if (!user) {
      res.status(500);
      throw new Error("Can't save to database");
    }

    res.status(201).json({
      code: 201,
      message: "success",
      data: user,
    });
  })
);

// autentification - перевірка даних які дав нам користувач із наявними в базі даних
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // отримуємо дані від користувача
    const { email, password } = req.body;

    // контролерна валідація даних
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    // шукаємо користувача в базі даних та розшифровуємо пароль
    const user = await UsersModel.findOne({ email });
    const validPassword = bcrypt.compareSync(password, user?.password ?? "");

    if (!user || !validPassword) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    // якщо користувач є в базі і паролі збігаютьсь, генеруємо токен доступу
    const token = generateToken({ id: user._id, email });

    // зберігаємо токен в базі та логінимо користувача
    user.token = token;
    const userWithToken = await user.save();

    if (!userWithToken) {
      res.status(500);
      throw new Error("Can't save token to database");
    }

    res.status(200).json({
      code: 200,
      message: "success",
      data: user.token,
    });
  })
);

// autorization - перевірка прав доступа виконувати певні дії на сайті або заходити на певні ресурси сайту

// logout - вихід із системи, втрачає всі свої права і доступи
app.get(
  "/logout",
  auth,
  asyncHandler(async (req, res) => {
    await UsersModel.findByIdAndUpdate(req.user.id, {
      token: null,
    });

    res.json({
      code: 200,
      message: "Success logout",
    });
  })
);

app.use("*", (req, res, next) => {
  res.status(404).json({ code: 404, message: "Not found" });
});

app.use((error, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const stack =
    process.env.NODE_ENV === "production"
      ? "Server in production mode, so we hide all errors, hehehe"
      : error.stack;
  res.status(statusCode).json({ code: res.statusCode, message: stack });
});

connectDb();
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(
    `Server is running on port: ${PORT}, mode: ${process.env.NODE_ENV}`.green
      .italic.bold
  );
});
