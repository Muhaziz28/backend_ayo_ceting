import express from 'express'
import { auth } from '../middleware/auth.js'
import { createVonisAwal } from '../controllers/VonisAwalController.js'

const router = express.Router()

router.post('/vonis/:id', auth, createVonisAwal)

export default router