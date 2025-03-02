const jwt = require('jsonwebtoken')
const User = require('../model/User')

const requireAuth = (req, res, next) =>{
    const token = req.cookies.authToken

    if(token){
        jwt.verify(token, 'book haven', async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                const user = await User.findById(decodedToken.id)
                req.user = user
                console.log(decodedToken)
                console.log(req.user)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}
const byPass = async(req, res, next) =>{
    const token = req.cookies.authToken

    if(!token){
        next()
    }

    try{
        const decodedToken = jwt.verify(token, 'book haven')
        const user = await User.findById(decodedToken.id)

        if(user){
            req.user = user;
            console.log(decodedToken)
            console.log(req.user)
        }
    } catch (err){
        console.log('FAILED TOKEN VERIFICATION', err.message)
    }
    next()
}

module.exports = {requireAuth, byPass}