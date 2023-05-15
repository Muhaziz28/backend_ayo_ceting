import Users from "../models/UserModel.js"
import payload from "../response_format.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import axios from "axios"
import dotenv from "dotenv"
import Roles from "../models/RolesModel.js"
import { Sequelize } from "sequelize"
import sendMail from "../helper/sendMail.js"
dotenv.config()

export const create_admin = async (req, res) => {
    try {
        const { username, password, email, name, phone_number, address, location, role_id, puskesmas_id } = req.body

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
        const coordinates = Sequelize.fn('ST_GeomFromText', `POINT(${location.longitude} ${location.latitude})`)

        const user = await Users.create({
            name: name,
            username: username,
            password: hashedPassword,
            phone_number: phone_number,
            address: address,
            location: coordinates,
            email: email,
            role_id: role_id,
            puskesmas_id: puskesmas_id
        })

        const puskesmas = await axios.get(`http://103.141.74.123:81/api/v1/puskesmas/detail/${user.puskesmas_id}`)
        const role = await Roles.findOne({
            where: {
                id: user.role_id
            },
            attributes: ["id", "role_name"]
        })

        const result = {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            role: role,
            puskesmas_id: user.puskesmas_id,
            puskesmas: puskesmas.data.data
        }

        return payload(200, true, "User created", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const register = async (req, res) => {
    try {
        const { name, username, password, email, phone_number, location, address } = req.body

        const emailExist = await Users.findOne({
            where: { email: email }
        })

        if (emailExist) return payload(400, false, "Invalid username or password", null, res)

        const usernameExist = await Users.findOne({
            where: { username: username }
        })

        if (usernameExist) return payload(400, false, "Invalid username or password", null, res)

        const salt = await bcrypt.genSalt(Number(10))
        const hashedPassword = await bcrypt.hash(password, salt)
        const coordinates = Sequelize.fn('ST_GeomFromText', `POINT(${location.longitude} ${location.latitude})`)

        await Users.create({
            name: name,
            username: username,
            password: hashedPassword,
            email: email,
            phone_number: phone_number,
            location: coordinates,
            address: address,
            role_id: 1,
        })

        const token = jwt.sign({ email: email }, process.env.JWTPRIVATEKEY, { expiresIn: "1d" })
        const activationLink = `http://localhost:5000/activate/` + token
        const emailText = `Halo ${name}, silahkan klik link berikut untuk mengaktifkan akun anda: ${activationLink}`

        sendMail(email, emailText)

        return payload(200, true, "Registrasi berhasil, check email anda untuk aktifasi akun anda", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const activate = async (req, res) => {
    try {
        const { token } = req.params
        const { email } = jwt.verify(token, process.env.JWTPRIVATEKEY)
        await Users.update({
            is_verified: true
        }, {
            where: { email: email }
        })

        return payload(200, true, "Akun anda berhasil diaktifasi", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const sendAcitvationLink = async (req, res) => {
    const { email } = req.body
    try {
        const token = jwt.sign({ email: email }, process.env.JWTPRIVATEKEY, { expiresIn: "1d" })
        const activationLink = `http://localhost:5000/activate/` + token
        const user = await Users.findOne({
            where: { email: email }
        })
        if (!user) return payload(400, false, "User not found", null, res)
        const emailText = `Silahkan klik link berikut untuk mengaktifkan akun anda: ${activationLink}`

        sendMail(email, emailText)
        return payload(200, true, "Link aktivasi berhasil dikirim", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        let user
        if (username.includes("@")) {
            user = await Users.findOne({
                where: { email: username }
            })
        } else {
            user = await Users.findOne({
                where: { username: username }
            })
        }

        if (!user) return payload(400, false, "Invalid username or password", null, res)

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return payload(400, false, "Invalid username or password", null, res)

        if (user.puskesmas_id != null) {
            const puskesmas = await axios.get(`http://103.141.74.123:81/api/v1/puskesmas/detail/${user.puskesmas_id}`)
            user.puskesmas = puskesmas.data.data
        }

        const role = await Roles.findOne({
            where: { id: user.role_id },
            attributes: ["id", "role_name"]
        })

        const token = jwt.sign({ id: user.id }, process.env.JWTPRIVATEKEY)
        res.cookie('token', token, { httpOnly: true });

        return payload(
            200, true, "Login success",
            {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    location: {
                        longitude: user.location.coordinates[0],
                        latitude: user.location.coordinates[1],
                    },
                    address: user.address,
                    phone_number: user.phone_number,
                    email: user.email,
                    role_id: user.role_id,
                    role: role,
                }
            },
            res)
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

        jwt.verify(token, process.env.JWTPRIVATEKEY)
        res.setHeader('Authorization', null)
        return payload(200, true, "Logout success", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}