const express = require('express')
const {get_login_page, login_post, signup_post, get_signup_page, logout} = require('../controllers/authController')

const router = express.Router()

router.get("/signup", get_signup_page);
router.post("/signup", signup_post);
router.get("/login", get_login_page);
router.post("/login", login_post);
router.get("/logout", logout);

module.exports = router;