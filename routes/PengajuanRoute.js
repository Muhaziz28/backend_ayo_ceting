import express from "express"
import { getPengajuan, getAllPengajuan, getPengajuanById, createPengajuan, deletePengajuan, approvePengajuan, rejectPengajuan } from "../controllers/PengajuanController.js"
import { admin, auth, user } from "../middleware/auth.js"

const router = express.Router()

// * Routes pengajuan for admin
router.get("/pengajuan", auth, admin, getAllPengajuan)
router.put("/pengajuan/approve/:id", auth, admin, approvePengajuan)
router.put("/pengajuan/reject/:id", auth, admin, rejectPengajuan)

router.get("/pengajuan/:id", auth, getPengajuanById)

// * Routes pengajuan for user
router.get("/pengajuan/user", auth, user, getPengajuan)
router.post("/pengajuan/user", auth, user, createPengajuan)


// router.delete("/pengajuan/:id", admin, deletePengajuan)


export default router