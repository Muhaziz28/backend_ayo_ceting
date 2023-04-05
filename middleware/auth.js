import jwt from "jsonwebtoken"
import payload from "../response_format.js"
import Users from "../models/UserModel.js";
// use env
import dotenv from "dotenv"
dotenv.config()

export const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization === undefined) {
            return payload(401, false, "Unauthorized", null, res)
        }
        const token = req.headers.authorization.split(" ")[1]
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


