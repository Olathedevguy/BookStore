import express from "express";
import mongoose from "mongoose";
import Book from "./model/storeModel.js";

const port = 3000;
const app = express();
const dbURI =
  "mongodb+srv://olamide:olamide@store.pkj3w.mongodb.net/Bookstore?retryWrites=true&w=majority&appName=Store";

app.use(express.urlencoded());
app.listen(port, () => {
  console.log(`\nServer is active on ${port}`);
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

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/books", async (req, res) => {
  try {
    const selectedGenre = req.query.genre || "All";
    const searchQuery = req.query.title;
    const books =
      selectedGenre !== "All"
        ? await Book.find({ genre: { $regex: selectedGenre } })
        : searchQuery
        ? await Book.find({
            $or: [
              { title: { $regex: searchQuery, $options: "i" } },
              { author: { $regex: searchQuery, $options: "i" } },
            ],
          })
        : await Book.find();
    res.render("books", { title: "Books", books });
  } catch (error) {
    console.log("Error fetching books", error);
  }
});

app.get("/upload", (req, res) => {
  res.render("upload", { title: "Upload" });
});

app.post("/upload", async (req, res) => {
  console.log("post request made to", req.path);
  // console.log(req.path)
  try {
    const book = await Book.create(req.body);
    res.redirect("/books");
    console.log("Uploaded Successfully");
  } catch (error) {
    console.log("Error Uploading book", error);
  }
});
