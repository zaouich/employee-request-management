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

memberShipSchema.post('findOneAndDelete',async function(doc, next) {
    await Request.findOneAndDelete({user:doc.user})
  });
const MemberShip = model("MemberShip",memberShipSchema)
module.exports = MemberShip
