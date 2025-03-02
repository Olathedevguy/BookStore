const Book = require("../model/storeModel");

const handleErr = (err)=>{
    console.log(err.message, err.code);
    let errors = {email: "", password: ""}
    
    if(err.message === 'incorrect email'){
        errors.email = 'No account found with this email'
    }
    
    if(err.message === 'incorrect password'){
        errors.password = 'invalid password'
    }
    
    if(err.code === 11000){
        errors.email = "That email is already in registered"
    }
    
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return {errors};
    }

module.exports.get_upload_page = (req, res) => {
  res.render("upload", { title: "Upload" });
}

module.exports.get_books = async (req, res) => {
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
  }


module.exports.upload_books = async (req, res, next) => {
    console.log("post request made to", req.path);
    console.log(req.file)
    // console.log(req.path)
    try {
      const book = await Book.create({
        title: req.body.title,
        // title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        imagePath: req.file ? "/uploads/" + req.file.filename : null, // Store image path to mongodb
      });
      res.redirect("/books");
      console.log("Uploaded Successfully:", book);
    } catch (error) {
      console.log("Error Uploading book", error);
    }
  }


module.exports.get_book_byID = async (req, res)=>{

    try{  
    const {id} = req.params;
    const book = await Book.findById(id.toString())
  
    if(!book) return res.status(404).send("Book not found")
      res.render('details', {title: 'details', book, email:req.user.email})
  
    } catch(err){
      console.log('eRROR FETCHING BOOk',err)
    }
  }

module.exports.edit_book = async (req, res)=>{
  
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
}

module.exports.delete_book = async (req, res) => {
  try {
    const {id} = req.params
    const book = await Book.findByIdAndDelete(id)
    // res.redirect('/books')
    res.status(200).json({redirectUrl: '/books'})
  } catch (error) {
    console.log("Error Occurred When Deleting:", error)
    res.status(500).json({message: err.message})
  }
};

module.exports.get_book_edit_page = async (req, res)=>{
  try {
  const {id} = req.params;
  const book = await Book.findById(id)
  if(!book)return res.status(400).send('<p>Book not found</p>')
    res.render('Edit', {title: 'Edit', book})
  } catch (error) {
    console.error(error)
    res.status(500).send('<p>Internal Server Error</p>')
  }

}