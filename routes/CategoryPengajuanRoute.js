import express from "express"
import { auth } from "../middleware/auth.js"
import { getAllCategoryPengajuan, getCategoryPengajuanById, createCategoryPengajuan, updateCategoryPengajuan, deleteCategoryPengajuan } from "../controllers/CategoryPengajuanController.js"

const router = express.Router()

router.get("/category_pengajuan", getAllCategoryPengajuan)
router.get("/category_pengajuan/:id", getCategoryPengajuanById)
router.post("/category_pengajuan", auth, createCategoryPengajuan)
router.put("/category_pengajuan/:id", updateCategoryPengajuan)
router.delete("/category_pengajuan/:id", deleteCategoryPengajuan)

export default router
