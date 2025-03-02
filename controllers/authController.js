const User = require("../model/User");
const jwt= require('jsonwebtoken')


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
  return jwt.sign({id}, 'book haven', {
    expiresIn: maxAge
  })
}

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

module.exports.get_signup_page = (req, res)=>{
    res.render('signup', {title:'Sign Up'})
  }

module.exports.signup_post = async(req, res)=>{
    try {
      const {email, password} = req.body;
      const user = await User.create({email, password});
      const token = createToken(user._id)
      res.cookie('authToken', token, {httpOnly: true, maxAge: maxAge * 1000})
      res.status(201).json({user: user._id});
    } catch (error) {
      const errors = handleErr(error)
      console.log('failed to create user', errors);
      res.status(400).json(errors);
    }
  }

module.exports.get_login_page = (req, res)=>{
    res.render('login', {title: 'Login'})
  }

module.exports.login_post = async(req, res)=>{
    const {email, password} = req.body;
  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('authToken', token, {httpOnly: true, maxAge: maxAge * 1000});
      res.status(200).json({user: user._id});
    } catch (error) {
      const errors = handleErr(error);
      console.log(errors)
      res.status(400).json(errors);
    }
  }

module.exports.logout = async(req, res)=>{
  res.cookie('authToken', '', {maxAge: 0})
  res.redirect('/login')//login
}