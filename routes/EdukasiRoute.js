import express from 'express'
import { auth } from '../middleware/auth.js'
import { getAllEdukasi, getEdukasiPerPuskesmas, createEdukasi, detailEdukasi, updateEdukasi, deleteEdukasi } from '../controllers/EdukasiController.js'

const router = express.Router()

router.get('/edukasi', auth, getAllEdukasi)
router.get('/edukasi/puskesmas', auth, getEdukasiPerPuskesmas)
router.post('/edukasi', auth, createEdukasi)
router.get('/edukasi/:slug', auth, detailEdukasi)
router.put('/edukasi/:id', auth, updateEdukasi)
router.delete('/edukasi/:id', auth, deleteEdukasi)

export default router