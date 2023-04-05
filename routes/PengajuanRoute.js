import express from "express"
import { getAllPengajuan, getPengajuanById, createPengajuan, deletePengajuan, approvePengajuan, rejectPengajuan, getPengajuanByDevice } from "../controllers/PengajuanController.js"
import { admin } from "../middleware/auth.js"

const router = express.Router()

router.get("/pengajuan/:id", getPengajuanById)
router.post("/pengajuan", createPengajuan)

router.get('/pengajuan/user/device/:id', getPengajuanByDevice)

router.get("/pengajuan", admin, getAllPengajuan)
router.delete("/pengajuan/:id", admin, deletePengajuan)
router.put("/pengajuan/approve/:id", admin, approvePengajuan)
router.put("/pengajuan/reject/:id", admin, rejectPengajuan)


export default router