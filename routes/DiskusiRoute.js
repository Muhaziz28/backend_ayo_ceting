import express from 'express'
import { auth } from '../middleware/auth.js'
import { getAllDiskusi } from '../controllers/DiskusiController.js'

const router = express.Router()
router.get('/diskusi/:id', auth, getAllDiskusi)

export default router