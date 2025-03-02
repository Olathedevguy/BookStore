const express = require('express')
const {get_home, get_books, get_upload_page, upload_books, signup_post, get_signup_page, get_book_byID, get_book_edit_page, edit_book, delete_book,} = require('../controllers/appControllers')
const multer = require('multer')
const path = require('path')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))//setting the filename to it's original name
    }
})
const upload = multer( {storage: storage} )

router.get('/books',  get_books)
router.get('/upload',requireAuth, get_upload_page)
router.post('/upload', upload.single('book-img'),  upload_books)
router.get('/books/:id', requireAuth, get_book_byID)
router.get('/books/edit/:id', requireAuth , get_book_edit_page)
router.put('/books/edit/:id', edit_book)
router.delete('/books/:id', delete_book)


module.exports = router;