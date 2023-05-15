import express from "express"
import { admin, auth } from "../middleware/auth.js"
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from "../controllers/RoleController.js"

const router = express.Router()

router.get('/roles', auth, getAllRoles)
router.get('/roles/:id', auth, getRoleById)
router.post('/roles', auth, admin, createRole)
router.put('/roles/:id', auth, admin, updateRole)
router.delete('/roles/:id', auth, deleteRole)

export default router