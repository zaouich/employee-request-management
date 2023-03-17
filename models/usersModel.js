const { Schema, model } = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")
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
        enum:["admin","employee"],
        message:'can be only admin or employee'
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

})
// hashing the password
userSchema.pre("save",function(next){
    if(! this.isModified("password")) return next()
    this.password = bcrypt.hashSync(this.password,12) 
    this.confirmPassword = undefined
    next()
})
userSchema.pre(/^find/,function(next){
    this.find({active:true})
    next()
})
userSchema.methods.isCorrectPassword = async function(condidatPassword){
    if(!await  bcrypt.compare(condidatPassword ,this.password)) return false
    return true
}
const User = model("User",userSchema)
module.exports = User