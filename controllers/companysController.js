const { stringify } = require("qs")
const Company = require("../models/companysModel")
const User = require("../models/usersModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

const checkOnlyExicts =catchAsync(async(req,res,next)=>{
    const id = req.params.id
    const company = await Company.findById(id)
    if(!company) return next(new AppError(400,"there is no comapny found by this Id"))
    req.company = company
    next()
})
const checkExicts = catchAsync(async(req,res,next)=>{
    const id = req.params.id
    const company = await Company.findById(id)
    if(!company || company.createdBy._id.toString() !=req.user._id.toString()) return next(new AppError(401,"there is no company found belong to you by this id"))
    next()
})
const getResult = (req,res,data,statusCode)=>{
    res.status(statusCode).json({
        status:'success',
        length:data.length,
        data
    })
}
const getAllCompanys =catchAsync(async (req,res,next)=>{
   if(req.user.role == "admin"){
    const companys = await Company.find({createdBy:req.user._id})
    getResult(req,res,companys,200)
   }
   else{
       const companys = await Company.find(query)
       getResult(req,res,companys,200)
   }
})
const getOneCompany = catchAsync(async(req,res,next)=>{
    const company =await Company.findById(req.params.id)
    if(!company) return next(new AppError(404,"there is no company found by this id"))
    getResult(req,res,company,200)
})
const createOneCompany = catchAsync(async(req,res,next)=>{
    const {name,email,description,password}= req.body
    const company = await Company.create({password,name,email,description,createdBy:req.user._id})
    getResult(req,res,company,201)
})
const updateCompany = catchAsync(async(req,res,next)=>{
    const body_ ={...req.body}
    const allowed = ["name","email","description"]
        Object.keys(body_).forEach(el=>{
            if(!allowed.includes(el)) delete body_[el]
        })
    const updated = await Company.findByIdAndUpdate(req.params.id,body_,{new:true , runValidators:true})
    getResult(req,res,updated,200)
   
})
const deleteCompany = async(req,res,next)=>{
    await Company.findByIdAndDelete(req.params.id)
    res.send("deleted")
}
module.exports = {getAllCompanys,getOneCompany,createOneCompany,updateCompany,deleteCompany,checkExicts,checkOnlyExicts}