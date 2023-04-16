import express from "express"
import { login, create_admin, logout, register } from "../controllers/AuthController.js"
import { admin, auth } from "../middleware/auth.js"

const router = express.Router()

// * Routes auth for admin
router.post('/create_admin', auth, admin, create_admin)
router.post('/login', login)
router.post('/logout', logout)

// * Routes auth for user
router.post('/register', register)

export default router
