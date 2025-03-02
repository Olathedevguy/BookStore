const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bookRoute = require('./routes/bookRoute')
const authRoutes = require('./routes/authRoutes');
const { requireAuth, byPass } = require("./middleware/authMiddleware");



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(cookieParser())



const port = 3000;
app.use("/uploads", express.static("uploads"));
const dbURI =
  "mongodb+srv://olamide:olamide@store.pkj3w.mongodb.net/Bookstore?retryWrites=true&w=majority&appName=Store";

app.listen(port, () => {
  console.log(`\nServer is active on ${port}, link: localhost:${port}`);
});

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("connected to the database!\n");
  })
  .catch((err) => {
    console.log("not connected tO db", err);
  });

app.set("view engine", "ejs");

app.get("/", byPass, (req, res) => {
  res.render("index", { title: "Home" , message: "Login Successful", type: "success", email: req.user ? req.user.email : 'Guest'});
});

app.use(bookRoute);



app.use(authRoutes)



