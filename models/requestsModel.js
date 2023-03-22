const { mongoose ,Schema , model} = require("mongoose");

const requestSchema = new Schema({
    createdAt : {
        type:Date,
        default : Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref : "User"
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref:"Company"
    },
    type:{
        type:String,
        required:[true,"a request must have a type"]
    },
    description : {
        type:String,
        required:[true,"a request must have a description"]
    },validate_:{
        type:String,
        enum:{
            values:["watting","regected","accepted"],
            message:'can be only watting or regected or accepted'
        },
        default:"watting"
    }
})


const Request = model("Request",requestSchema)
module.exports = Request