const { Router } = require("express")
const { checkLogin, restrictTo } = require("../controllers/authController")
const { checkExicts, checkOnlyExicts } = require("../controllers/companysController")
const { getAllMemberShipsInCompany, joinCompany, getOneMemberShipInCompany, exitCompany, kickOutUser, checkJoinedCompany, checkAdmin } = require("../controllers/memberShipsController")

const router = Router({mergeParams:true})
router.use(checkLogin)
router.route("/").get(restrictTo("admin"),checkExicts,getAllMemberShipsInCompany).post(checkOnlyExicts,joinCompany).delete(checkOnlyExicts,checkJoinedCompany,checkAdmin,exitCompany)
router.route("/:memberShipId").get(restrictTo("admin"),checkExicts,getOneMemberShipInCompany).delete(restrictTo("admin"),checkExicts,checkAdmin,kickOutUser)
module.exports = router