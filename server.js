import express from "express";
import mongoose from "mongoose";
import Book from "./model/storeModel.js";
import multer from "multer";
import path from "path"
import methodOverride from "method-override"
import { title } from "process";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))//setting the filename to it's original name
  }
})

const upload = multer( {storage: storage} )
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

app.post("/upload", upload.single('book-img'), async (req, res, next) => {
  console.log("post request made to", req.path);
  console.log(req.file)
  // console.log(req.path)
  try {
    const book = await Book.create({
      title: req.body.title,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      imagePath: req.file ? "/uploads/" + req.file.filename : null, // Store image path to mongodb
    });
    res.redirect("/books");
    console.log("Uploaded Successfully:", book);
  } catch (error) {
    console.log("Error Uploading book", error);
  }
});

app.get('/books/:id', async (req, res)=>{

  try{  
  const {id} = req.params;
  const book = await Book.findById(id.toString())

  if(!book) return res.status(404).send("Book not found")
    res.render('details', {title: 'details', book})

  } catch(err){
    console.log('eRROR FETCHING BOOk',err)
  }
})

app.get('/books/edit/:id', async (req, res)=>{
  try {
  const {id} = req.params;
  const book = await Book.findById(id)
  if(!book)return res.status(400).send('<p>Book not found</p>')
    res.render('Edit', {title: 'Edit', book})
  } catch (error) {
    console.error(error)
    res.status(500).send('<p>Internal Server Error</p>')
  }

})

app.put('/books/edit/:id', async (req, res)=>{
  
  try{
    const {id} = req.params;
    const book = await Book.findByIdAndUpdate(id, {
      title: req.body.title,
      author: req.body.author,
    }, {new: true})
    if(!book)return res.status(404).send('<p>book not found</p>')
      res.json({ message: "Book updated successfully", book})
  }catch(err) {
    console.error(err)
  };
})

app.delete('/books/:id', async (req, res) => {
  try {
    const {id} = req.params
    const book = await Book.findByIdAndDelete(id)
    // res.redirect('/books')
    res.status(200).json({redirectUrl: '/books'})
  } catch (error) {
    console.log("Error Occurred When Deleting:", error)
    res.status(500).json({message: err.message})
  }
})
