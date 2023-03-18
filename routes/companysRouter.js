const { Router } = require("express")
const { checkLogin, restrictTo, checkPassword } = require("../controllers/authController")
const { getAllCompanys, getOneCompany, createOneCompany, checkExicts, updateCompany, deleteCompany } = require("../controllers/companysController")
const memberShipsRouter = require("./memberShipsRouter")
const router = Router()
router.route("/").get(checkLogin, getAllCompanys).post(checkLogin,restrictTo("admin"), createOneCompany)
router.route("/:id").get(checkLogin, getOneCompany).patch(checkLogin,restrictTo("admin"),checkExicts,updateCompany).delete(checkLogin,restrictTo("admin"),checkExicts,checkPassword,deleteCompany)
router.use("/:id/memberShips",memberShipsRouter)
module.exports = router