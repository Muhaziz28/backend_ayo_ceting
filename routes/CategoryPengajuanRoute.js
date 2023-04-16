import express from "express"
import { admin, auth } from "../middleware/auth.js"
import { getAllCategoryPengajuan, getCategoryPengajuanById, createCategoryPengajuan, updateCategoryPengajuan, deleteCategoryPengajuan } from "../controllers/CategoryPengajuanController.js"

const router = express.Router()

router.get("/category_pengajuan", auth, getAllCategoryPengajuan)
router.get("/category_pengajuan/:id", auth, admin, getCategoryPengajuanById)
router.post("/category_pengajuan", auth, admin, createCategoryPengajuan)
router.put("/category_pengajuan/:id", auth, admin, updateCategoryPengajuan)
router.delete("/category_pengajuan/:id", auth, admin, deleteCategoryPengajuan)

export default router
