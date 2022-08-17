require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth/auth");
const homeRouter = require("./routes/home");
const worldRouter = require("./routes/world");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const connectDB = require("./Database/connect");

connectDB();

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRECT));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images_store")));

app.get("/", (req, res) => {
  res.render("index", { title: "Personal Library" });
});

app.use("/users/auth", authRoutes);

app.use("/home", homeRouter.home);
app.use("/home/reviews", homeRouter.reviews);
app.use("/home/discussions", homeRouter.discussions);

app.use("/world", worldRouter.world);
app.use("/world/reviews", worldRouter.reviews);
app.use("/world/discussions", worldRouter.discussions);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Sập con mịa nó Server rồi" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running...");
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
