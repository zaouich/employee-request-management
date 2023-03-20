const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/usersModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const sendMail = require("../utils/sendMail")

const sendUser = (res,user)=>{
    res.status(200).json({
        status:"success",
        user
    })
}
const checkPassword = catchAsync(async(req,res,next)=>{
    const {password} = req.body
    const user = await User.findById(req.user._id)
    if(!password ||! await user.isCorrectPassword(password)) return next(new AppError(401,"enter a valid password"))
    next()
})
const checkLogin = async(req,res,next)=>{
    if(!req.cookies.jwt){
        return next(new AppError(401,"please login first"))
    }
    const jwt_ = req.cookies.jwt
    const jwt_verified =  jwt.verify(jwt_,process.env.JWT_SECRET)
    // check if the user still exicts
    const user =await User.findById(jwt_verified.id)
    if(!user) return next(new AppError(400,'the user is no longer exicts , please login first'))
    // check if the user changed his password
    if(await user.isChangedPassword(jwt_verified.iat)) return next(new AppError(400,"the user has been change his password"))
    req.user = user
    next()
}
const checkLoginWithoutErrors = async(req,res,next)=>{
    if(!req.cookies.jwt){
        return sendUser(res,null)
    }
    const jwt_ = req.cookies.jwt
    const jwt_verified =  jwt.verify(jwt_,process.env.JWT_SECRET)
    // check if the user still exicts
    const user =await User.findById(jwt_verified.id)
    if(!user) return sendUser(res,null)
    // check if the user changed his password
    if(await user.isChangedPassword(jwt_verified.iat)) return sendUser(res,null)
    sendUser(res,user)
}
const restrictTo = (...roles) =>{
    return (req,res,next)=>{
        if(! roles.includes(req.user.role) ) return next(new AppError(400,"you are not allowed to do that as an employee"))
        next()
    }
}
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
const updateMe = catchAsync(async(req,res,next)=>{
    const body_ = {...req.body}
    if(req.body.password) return next(new AppError(400,"you cant change your password here check this : /users/updatePassword"))
    const allowed = ["userName","firstName","lastName","email"]
    Object.keys(body_).forEach(el=>{
        if(!allowed.includes(el)) delete body_[el]
    })
    const userId = req.user._id
    const user =await User.findByIdAndUpdate(userId,body_,{runValidators : true , new:true})
    res.status(201).json({
        status:"success",
        user
    })
})
const updatePassword = catchAsync(async(req,res,next)=>{
    const user= await User.findById(req.user._id) 
    const {old_password , password , confirmPassword} = req.body
    if(!old_password) return next(new AppError(401,"you should provide a correct old password"))
    if(!password ||!confirmPassword) return next(new AppError(400,"you should provide your password and confirm it"))
    user.password = password
    user.confirmPassword = confirmPassword
    await user.save()
    res.status(200).json({
        status:"success",
        user
    })
})
const deleteMe = catchAsync(async(req,res,next)=>{
    const user= await User.findById(req.user._id)
    if(!req.body.password || !await user.isCorrectPassword(req.body.password)) return next(new AppError(401,"you should provide your password"))
    user.active = false
    await user.save({validateBeforeSave:false})
    console.log(user)
    res.status(204).send("okay by by")
})
const forgotPassword = catchAsync(async(req,res,next)=>{
    const {email}= req.body
    if(!email) return next(new AppError(401,"please enter you email"))
    const user = await User.findOne({email})
    console.log(user)
    if(!user) return next(new AppError(400,"there is no user uer found by this email"))
    const token = await user.createResetToken()
    const data_ = {
        subject:"expires in 10 min",
        to:email,
        text :` ${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${token}`

    }
    await user.save({validateBeforeSave:false})
    await sendMail(data_)
    res.status(200).send("check you mail !")

})
const resetPassword = catchAsync(async(req,res,next)=>{
    const {password,confirmPassword} = req.body
    const token = req.params.resetToken
    const _token = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({resetToken:_token , expiresResetToken:{$gte :new Date(Date.now())}})
    if(!user) return next(new AppError(400,"invalid or expires reset link"))
    if(!password || !confirmPassword) return next(new AppError(400,"please enter the new password and confirm it"))
    user.password = password
    user.confirmPassword = confirmPassword
    user.resetToken = undefined
    user.expiresResetToken=undefined
    await user.save()
    passport(req,res,user)
})
module.exports = {signUp,login,checkLogin,updateMe,deleteMe,updatePassword,forgotPassword,resetPassword,restrictTo,checkPassword,checkLoginWithoutErrors}