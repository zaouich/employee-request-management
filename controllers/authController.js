const jwt = require("jsonwebtoken")
const User = require("../models/usersModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

const passport = (req,res,user)=>{
    const jwt_ = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
    res.cookie("jwt",jwt_,{
        expires :new Date(Date.now()+90*24*60*60000)
    })
    res.status(201).json({
        status:"success",
        user : user,
        jwt_
    })
}
const signUp = catchAsync(async(req,res,next)=>{
    const {userName,firstName,lastName,role,email,password,confirmPassword} = req.body
    const newUser = await User.create({
        userName,firstName,lastName,role,email,password,confirmPassword
    })
    passport(req,res,newUser)
})
const login =catchAsync( async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || ! password) return next(new AppError(401,"you should provide your email and password"))
    const user = await User.findOne({email})    
    if(!user ||! await user.isCorrectPassword(password)) return next(new AppError(401,"incorrect email or password"))
    passport(req,res,user)
})
module.exports = {signUp,login}