import Users from "../models/UserModel.js"
import payload from "../response_format.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config()

export const register = async (req, res) => {
    try {
        const { username, password, email, role_id } = req.body

        const userExist = await Users.findOne({
            where: {
                email: email
            }
        })
        if (userExist) {
            return payload(400, false, "User already exist", null, res)
        }

        const salt = await bcrypt.genSalt(Number(10))
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await Users.create({
            username: username,
            password: hashedPassword,
            email: email,
            role_id: role_id
        })

        return payload(200, true, "User created", user, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({
            where: {
                email: email
            }
        })

        console.log(user)

        if (!user) {
            return payload(400, false, "Invalid email or password", null, res)
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return payload(400, false, "Invalid email or password", null, res)
        }
        const token = jwt.sign({ id: user.id }, process.env.JWTPRIVATEKEY)
        res.cookie('token', token, { httpOnly: true });

        return payload(
            200, true, "Login success",
            {
                token: token,
                user: user
            }
            , res)

    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const logout = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return payload(401, false, "Unauthorized", null, res)
        }
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return payload(401, false, "Unauthorized", null, res)
        }
        console.log(`token: ${token}`)
        jwt.verify(token, process.env.JWTPRIVATEKEY)
        res.setHeader('Authorization', null)
        return payload(200, true, "Logout success", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}