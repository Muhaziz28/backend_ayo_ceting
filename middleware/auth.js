import jwt from "jsonwebtoken"
import payload from "../response_format.js"
import Users from "../models/UserModel.js";
// use env
import dotenv from "dotenv"
import Roles from "../models/RolesModel.js";
dotenv.config()

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return payload(401, false, "Unauthorized", null, res)
        }
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
        const user = await Users.findByPk(decoded.id)

        if (!user) {
            return payload(401, false, "Unauthorized", null, res)
        }
        req.user = user

        next()
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const admin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return payload(401, false, "Unauthorized", null, res)
        }
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
        const user = await Users.findByPk(decoded.id, {
            include: {
                model: Roles,
                attributes: ["role_name"]
            }
        })

        if (!user) {
            return payload(401, false, "Unauthorized", null, res)
        }

        if (user.role.role_name !== "Administrator") {
            return payload(401, false, "Unauthorized", null, res)
        }
        next()
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

