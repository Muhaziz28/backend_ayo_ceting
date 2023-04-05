import express from "express"
import { getAllPuskesmas } from "../controllers/PuskesmasController.js"

const router = express.Router()

router.get('/puskesmas', getAllPuskesmas)

export default router