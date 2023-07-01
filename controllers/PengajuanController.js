import { Sequelize } from "sequelize"
import CategoryPengajuan from "../models/CategoryPengajuanModel.js"
import Pengajuan from "../models/PengajuanModel.js"
import payload from "../response_format.js"
import Users from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import axios from "axios"
import VonisAwal from "../models/VonisAwalModel.js"

export const getAllPengajuan = async (req, res) => {
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

        // const puskesmas = await axios.get(`http://103.141.74.123:81/api/v1/puskesmas/detail/${user.puskesmas_id}`)
        // console.log(puskesmas.data.data)

        const pengajuan = await Pengajuan.findAll({
            // where: Sequelize.where(
            //     Sequelize.fn('ST_Distance_Sphere', Sequelize.col('lokasi'), Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(puskesmas.data.data.lokasi))),
            //     {
            //         [Sequelize.Op.lte]: 1000
            //     }
            // ),
            include: [
                {
                    model: Users,
                    attributes: ["id", "name", "phone_number"]
                },
                {
                    model: CategoryPengajuan,
                    attributes: ["id", "category_name"]
                },
		    {
                    model: VonisAwal,
                    attributes: ["id", "vonis"]
                }
            ],
            order: [["created_at", "DESC"]],
        })

	for (let i = 0; i < pengajuan.length; i++) {
            const lokasiFormat = {
                latitude: pengajuan[i].lokasi.coordinates[0],
                longitude: pengajuan[i].lokasi.coordinates[1]
            }
            pengajuan[i].lokasi = lokasiFormat
        }

        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const getPengajuanByIdAdmin = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const id = req.params.id
        if (!token) {
            return payload(401, false, "Unauthorized", null, res)
        }
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
        const user = await Users.findByPk(decoded.id)
        if (!user) {
            return payload(401, false, "Unauthorized", null, res)
        }

        const pengajuan = await Pengajuan.findOne({
            where: { id: id },
            include: [
                {
                    model: Users,
                    attributes: ["id", "name", "phone_number"]
                },
                {
                    model: CategoryPengajuan,
                    attributes: ["id", "category_name"]
                },
            ],
            order: [["created_at", "DESC"]],
        })
        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const getPengajuan = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        return payload(401, false, "Unauthorized", null, res)
    }
    console.log(`token: ${token}`)
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
        if (err) {
            return payload(401, false, "Unauthorized", null, res)
        }
    })

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    const user = await Users.findByPk(decoded.id)
    try {
        const pengajuan = await Pengajuan.findAll({
            where: { user_id: user.id },
            include: [
                {
                    model: CategoryPengajuan,
                    as: "category_pengajuan",
                    attributes: ["category_name"],
                },
                {
                    model: Users,
                    as: "user",
                    attributes: ["name"]
                },
                {
                    model: VonisAwal,
                    attributes: ["id", "vonis"]
                }
            ],
            order: [["created_at", "DESC"]],
        })

	for (let i = 0; i < pengajuan.length; i++) {
            const lokasiFormat = {
                latitude: pengajuan[i].lokasi.coordinates[0],
                longitude: pengajuan[i].lokasi.coordinates[1]
            }
            pengajuan[i].lokasi = lokasiFormat
        }

        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const getPengajuanById = async (req, res) => {
    try {
        const pengajuan = await Pengajuan.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: CategoryPengajuan,
                    as: "category_pengajuan",
                    attributes: ["category_name"]
                },
                {
                    model: Users,
                    as: "user",
                    attributes: ["name", "phone_number"]
                },{
                    model: VonisAwal,
                    attributes:["id", "vonis"]
                }
            ]
        })
        if (pengajuan === null) {
            return payload(404, false, "Data tidak ditemukan", null, res)
        }
        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const createPengajuan = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        return payload(401, false, "Unauthorized", null, res)
    }

    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
        if (err) {
            return payload(401, false, "Unauthorized", null, res)
        }
    })

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    const user = await Users.findByPk(decoded.id)

    try {
        const { isi_pengajuan, category_pengajuan_id, lokasi, alamat_lengkap } = req.body
        const coordinates = Sequelize.fn('ST_GeomFromText', `POINT(${lokasi.longitude} ${lokasi.latitude})`)

        const pengajuan = await Pengajuan.create({
            user_id: user.id,
            isi_pengajuan: isi_pengajuan,
            category_pengajuan_id: category_pengajuan_id,
            lokasi: coordinates,
            alamat_lengkap: alamat_lengkap,
        })

        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const deletePengajuan = async (req, res) => {
    try {
        await Pengajuan.destroy({
            where: {
                id: req.params.id
            }
        })
        return payload(200, true, "Pengajuan berhasil di hapus", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const approvePengajuan = async (req, res) => {
    try {
        const pengajuan = await Pengajuan.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!pengajuan) {
            return payload(404, false, "Pengajuan tidak ditemukan", null, res)
        }
        if (pengajuan.status === "approved") {
            return payload(400, false, "Pengajuan sudah di approve", null, res)
        }
        pengajuan.update({
            status: "approved",
            discussion_status: true
        })

        return payload(200, true, "Pengajuan berhasil di approve", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const rejectPengajuan = async (req, res) => {
    try {
        const pengajuan = await Pengajuan.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!pengajuan) {
            return payload(404, false, "Pengajuan tidak ditemukan", null, res)
        }
        if (pengajuan.status === "approved") {
            return payload(400, false, "Pengajuan sudah di approve, tidak bisa di reject", null, res)
        }
        if (pengajuan.status === "rejected") {
            return payload(400, false, "Pengajuan sudah di reject", null, res)
        }
        pengajuan.status = "rejected"
        await pengajuan.save()
        return payload(200, true, "Pengajuan berhasil di reject", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}
