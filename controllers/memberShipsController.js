const MemberShip = require("../models/memberShipsModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

const getData = (req,res,data,statusCode)=>{
    res.status(statusCode).json({
        status:"success",
        length : data.length,
        data
    })
}
const checkJoinedCompany = catchAsync(async(req,res,next)=>{
    const memberShip =await MemberShip.findOne({user:req.user._id , company:req.params.id})
    if(!memberShip) return next(new AppError(400,"you are not joined this company"))
    next()
})
const checkAdmin = catchAsync(async(req,res,next)=>{
    if(req.company.createdBy._id.toString() == req.user._id) return next(new AppError(400,'you are the admin you can only delete the company'))
    console.log(req.company.createdBy._id.toString()==req.user._id)
    next()
})
const getAllMemberShipsInCompany = catchAsync(async(req,res,next)=>{ // get all memberships | checkLogin , admin , owner of comapny , |get companys/id/memberShips
    const memberShips = await MemberShip.find({company:req.params.id}).populate("user","-password")
    getData(req,res,memberShips,200)
})
const getOneMemberShipInCompany = catchAsync(async(req,res,next)=>{//get one membership | checkLogin , admin , owner of comapny ,companys/id/memberShips/memberShipId
    const memberShip= await MemberShip.find({company:req.params.id , _id:req.params.memberShipId}) 
    getData(req,res,memberShip,200)
})
const joinCompany = catchAsync(async(req,res,next)=>{ // add member ship  | checkLogin ,  the comapny exicts ,|post companys/id/memberShips
    const {password}= req.body
    if(!password || req.company.password !==password) return next(new AppError(400,"please provide a correct password"))
    const memberShip = await MemberShip.create({
        user:req.user._id,
        company : req.params.id
    })
    getData(req,res,memberShip,201)
})
const exitCompany = catchAsync(async(req,res,next)=>{// delete member ship | checkLogin ,  the membership exicts ,|delete companys/id/memberShips
    await MemberShip.findOneAndDelete({company:req.params.id ,user:req.user._id})
    res.send("you have been exit this company")
})
const kickOutUser = catchAsync(async(req,res,next)=>{ //delete member ship as admin
    const memberShip = await MemberShip.findByIdAndDelete(req.params.memberShipId)  //kick out the user | checkLogin , admin , owner of comapny , |delete companys/id/memberShips/memberShipId
    if(!memberShip)return next(new AppError(400,"this user is not in the company !"))
    res.send("you kiked out the user")
})
const getAllJoined =catchAsync( async(req,res,next)=>{
    const joined =await MemberShip.find({user:req.user._id})
    getData(req,res,joined)
})
module.exports = {kickOutUser,exitCompany,joinCompany,getOneMemberShipInCompany,checkJoinedCompany,getAllMemberShipsInCompany,checkAdmin}