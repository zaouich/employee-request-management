const { mongoose ,Schema , model} = require("mongoose");
const User = require("./usersModel");

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
    user_info :{
        type:Object
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
},{toJSON:{virtuals:true},toObject:{virtuals:true}})

requestSchema.pre("save",async function(next){
    const user = await User.findById(this.user)
    this.user_info = user

})
requestSchema.post(/^find/,function(doc){
    doc.user_info = {a:"jio"}
    
})
const Request = model("Request",requestSchema)
module.exports = Request