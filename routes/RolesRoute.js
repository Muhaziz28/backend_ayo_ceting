import express from "express"
import { auth } from "../middleware/auth.js"
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from "../controllers/RoleController.js"

const router = express.Router()

router.get('/roles', getAllRoles)
router.get('/roles/:id', getRoleById)
router.post('/roles', auth, createRole)
router.put('/roles/:id', auth, updateRole)
router.delete('/roles/:id', auth, deleteRole)

export default router