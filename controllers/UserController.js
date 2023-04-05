import Users from "../models/UserModel.js"
import payload from "../response_format.js"
import { auth } from "../middleware/auth.js"
import Roles from "../models/RolesModel.js"
import jwt from "jsonwebtoken"

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: 'Anda belum login' });
        }

        jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Anda belum login' });
            }
        })

        const user = await Users.findByPk(req.user.id, {
            attributes: {
                exclude: ["password", "role_id", "updated_at"]
            },
            include: [
                {
                    model: Roles,
                    attributes: ["role_name"]
                }
            ]
        })
        return payload(200, true, "User found", user, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}


