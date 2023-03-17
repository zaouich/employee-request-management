const { Router } = require("express");
const { signUp, login, updateMe, checkLogin, updatePassword, deleteMe, forgotPassword, resetPassword } = require("../controllers/authController");

const router = Router()
router.post("/signUp",signUp)
router.post("/login",login)
router.post("/updateMe",checkLogin,updateMe)
router.post("/updatePassword",checkLogin,updatePassword)
router.post("/deleteMe",checkLogin,deleteMe)
router.post("/forgotPassword",forgotPassword)
router.post("/resetPassword/:resetToken",resetPassword)
router.post("/post",(req,res,next)=>console.log("ko"))
module.exports = router