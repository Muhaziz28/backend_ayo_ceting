import express from 'express'
import { auth } from '../middleware/auth.js'
import { getAllDiskusi, sendDiskusi } from '../controllers/DiskusiController.js'

const router = express.Router()
router.get('/diskusi/:id', auth, getAllDiskusi)
router.post('/diskusi/:id', auth, sendDiskusi)

export default router