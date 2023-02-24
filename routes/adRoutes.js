const express = require("express")
const router = express.Router()

const {
    setAd,
    getAds,
    getAllAds,
    updateAd,
    deleteAd,
} = require("../controllers/adController")

const { protect } = require("../middleware/authMiddleware")
const { protectAdmin } = require("../middleware/adminAuthMiddleware")

router.route("/").get(protect, getAds).post(protect, setAd)
router.route("/list").get(protectAdmin, getAllAds)
router.route("/:id").put(protect, updateAd).delete(protect, deleteAd)

module.exports = router
