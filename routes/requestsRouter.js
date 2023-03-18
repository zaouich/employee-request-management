const { Router } = require("express");
const { checkLogin, restrictTo, checkPassword } = require("../controllers/authController");
const { checkExicts, checkOnlyExicts } = require("../controllers/companysController");
const { checkJoinedCompany } = require("../controllers/memberShipsController");
const { getAllRequests, checkRequsetExicts, addRequest, getOneRequest, checkRequsetExictsAndOwner, updateRequestAsEmployee } = require("../controllers/requestsController");

const router = Router({mergeParams:true})
// comapanys/id/requests/
router.use(checkLogin)
router.route("/").get(restrictTo("admin"),checkExicts,getAllRequests).post(checkOnlyExicts,checkJoinedCompany,addRequest)
router.route("/:requestId").get(restrictTo("admin"),checkExicts,checkRequsetExicts,getOneRequest).patch(checkOnlyExicts,checkJoinedCompany,checkRequsetExictsAndOwner,updateRequestAsEmployee).delete(checkOnlyExicts,checkJoinedCompany,checkRequsetExictsAndOwner,updateRequestAsEmployee,checkPassword)
module.exports = router