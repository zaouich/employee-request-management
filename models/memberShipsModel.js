const { Schema,  mongoose , model } = require("mongoose");

const memberShipSchema = new Schema({
    createdAt: {
        type:Date,
        default:new Date(),
    },
    user : {
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    company :{
        type:mongoose.Schema.ObjectId,
        ref:"Company"
    }
})
memberShipSchema.index({user:1 , company :1},{unique:true})
const MemberShip = model("MemberShip",memberShipSchema)
module.exports = MemberShip