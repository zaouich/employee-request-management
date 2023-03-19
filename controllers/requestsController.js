const Request = require("../models/requestsModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const checkRequsetExicts=catchAsync(async(req,res,next)=>{
    const request = await Request.findById(req.params.requestId)
    if(!request) return next(new AppError(400,"there is no request found by this id"))
    req.request = request
    next()
})
const checkRequsetExictsAndOwner = catchAsync(async(req,res,next)=>{
    const request  =await Request.findOne({user:req.user._id,_id:req.params.requestId})
    if(!request) return next(new AppError(400,'there is no request for you found by this id'))
    next()
})
const getData = (req,res,data,statusCode)=>{
    res.status(statusCode).json({
        status:"success",
        data
    })
}
const getAllRequests = catchAsync(async(req,res,next)=>{ // get all the company quests | checkLogin , check admin , check company owner + exicts |get /companys/id/requests
    
    const requests =await Request.find({validate_:req.query.validate_,company:req.params.id})
    getData(req,res,requests,200)
    
})
const getOneRequest = catchAsync(async(req,res,next)=>{// get one request in the company | checkLogin,check admin , check company owner + exicts ,check exicts request |get /company/id/requests/reequsetId
    const request = req.request
    getData(req,res,request,200)
})
const addRequest =catchAsync(async(req,res,next)=>{ // add requset to the company |post checkLogin , check company exicts , check joined |post /companys/id/requests
    const {type,description} = req.body
    const newRequest = await Request.create({type,description,company:req.params.id,user:req.user._id})
    getData(req,res,newRequest,201)
})
const updateRequestAsEmployee = catchAsync(async(req,res,next)=>{// update your request | checkLogin , check company exicts , check joined,check request exicts + its owner |/compays/id/requests/requestId
    const body_ = {...req.body}
    const allowed = ["type","description"]
        Object.keys(body_).forEach(el=>{
            if(!allowed.includes(el)) delete body_[el]
        })
    const request = await Request.findByIdAndUpdate(req.params.requestId,body_,{new:true,runValidators:true})
    getData(req,res,request,200)
})
const deleteRequestAsEmployee = catchAsync(async(req,res,next)=>{//delete your request | checkLogin , check company exicts , check joined,check request exicts + its owner,checkPassword |/compays/id/requests/requestId
    await Request.findByIdAndDelete(req.params.requestId)
    res.send("deleted")
})
const validateRequest = catchAsync(async(req,res,next)=>{// validate the request |checkLogin,check admin , check company owner + exicts ,check exicts request|/compays/id/requests/requestId
    const {status} = req.body
    if(!status) return next(new AppError(400,"WHAT ?"))
    const body_ = {validate_:status}
        const request = await Request.findByIdAndUpdate(req.params.requestId,body_,{new:true,runValidators:true})
        getData(req,res,request,200)
})
module.exports = {checkRequsetExicts,checkRequsetExictsAndOwner,getAllRequests,getOneRequest,addRequest,updateRequestAsEmployee,deleteRequestAsEmployee,validateRequest}