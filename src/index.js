require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();

const indexRoute = require("./routes/index");
const authRoutes = require("./routes/auth/auth");
const homeRouter = require("./routes/home");
const worldRouter = require("./routes/world");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const connectDB = require("./database/connect");

connectDB();

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRECT));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(
  "/images",
  express.static(path.join(process.cwd(), "review_images_store"))
);
app.use(
  "/users/avatar",
  express.static(path.join(process.cwd(), "avatar_images_store"))
);

app.use("/", indexRoute);

app.use("/users/auth", authRoutes);

app.use("/home", homeRouter.home);
app.use("/home/reviews", homeRouter.reviews);
app.use("/home/discussions", homeRouter.discussions);

app.use("/world", worldRouter.world);
app.use("/world/reviews", worldRouter.reviews);
app.use("/world/discussions", worldRouter.discussions);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  let message = "Internal Server Error";

  if (statusCode >= 500) console.log(error);

  if (statusCode === 400) message = error.message;
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running...");
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
