const { Schema, model } = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const userSchema = new Schema({
    userName:{
        type:String,
        required:[true,"a user must have a username"],
        minlenght:[5,"a user name can only be more than 5 length"],
        maxlenght:[12,"a user cant be more that 10 length"],
    },
    firstName:{
        type:String,
        required:[true,"a user must have a first name"],
    },
    lastName:{
        type:String,
        required:[true,"a user must have a first name"],
    },
    role:{
        type:String,
        required:[true,"please provide a role"],
        enum:{
            values:["admin","employee"],
            message:'can be only admin or employee'
        },
    },
    email:{
        type : String,
        unique:true,
        required:[true,"a user must have an email"],
        validate:[validator.isEmail , "please enter a valid email adress"]
    },
    password : {
        type: String,
        required:[true,"why no password"],
        trim:true,
        minlength:[8,"password should be more than 8 char"]
    },
    confirmPassword:{
        type:String,
        required:[true,"please confirm your password"],
        validate:{validator:
            function(confirmed){
            return this.password ===confirmed
        },message:"the passwords not match",
        
    }
    },
    changedAt : {
        type:Date
    },
    resetToken : {
        type:String
    },expiresResetToken:{
        type:Date
    },
    active:{
        type:Boolean,
        default :true
    }

},{toJSON:{virtuals:true},toObject:{virtuals:true}})
userSchema.virtual("joinedCompanies",{
    ref:"MemberShip",
    foreignField:"user",
    localField:"_id"
})
userSchema.virtual("requests",{
    ref:"Request",
    foreignField:"user",
    localField:"_id"
})
// hashing the password
userSchema.pre("save",function(next){
    if(! this.isModified("password")) return next()
    this.password = bcrypt.hashSync(this.password,12) 
    this.confirmPassword = undefined
    if(! this.isNew){
        this.changedAt = new Date()
    }
    next()
})
userSchema.pre(/^find/,function(next){
    this.find({active:true}).populate("joinedCompanies").populate("requests")
    next()
})
userSchema.methods.isCorrectPassword = async function(condidatPassword){
    if(!await  bcrypt.compare(condidatPassword ,this.password)) return false
    return true
}
userSchema.methods.isChangedPassword = async function(creationDate){
    if(!this.changedAt) return false 
    return  parseInt(this.changedAt.getTime()/1000) > creationDate
}
userSchema.methods.createResetToken = async function(){
    const token =  crypto.randomBytes(32).toString("hex")
    const _token = crypto.createHash("sha256").update(token).digest("hex")
    this.resetToken = _token
    this.expiresResetToken = new Date(Date.now() + 10*60*1000)
    return token
}
const User = model("User",userSchema)
module.exports = User