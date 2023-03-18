const { Schema, mongoose, model } = require("mongoose");
const validator = require("validator");
const MemberShip = require("./memberShipsModel");
const companyShcema = new Schema({
    name : {
        type:String,
        required:[true,"a company must have a name"],
        unique:true
    },email:{
        type:String,
        required:[true,"a compay must have an email"],
        unique:true,
        validate : [validator.isEmail,"a comapy must have a correct email"]
    },
    description:{
        type:String,
        required:[true,"please provide a description for the company"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },password:{
        type:String,
        required:[true,"a company must have a password"],
        minlength : [10,"password cant be less than 10 char"]
    }
})
companyShcema.pre(/^find/,function(next){
    this.find({}).populate("createdBy","-password")
    next()
})
companyShcema.pre("save",function(next){
    MemberShip.create({company:this._id,user:this.createdBy})
    next()
})
companyShcema.post('findOneAndDelete',async function(doc, next) {
    await MemberShip.findOneAndDelete({company:doc._id})
  });
const Company = model("Company",companyShcema)
module.exports = Company