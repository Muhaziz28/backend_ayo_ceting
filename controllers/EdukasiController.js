import axios from "axios"
import Edukasi from "../models/EdukasiModel.js"
import Users from "../models/UserModel.js"
import payload from "../response_format.js"
import Roles from "../models/RolesModel.js"
import dotenv from "dotenv"

dotenv.config()

export const getAllEdukasi = async (req, res) => {
    try {
        const edukasi = await Edukasi.findAll({
            attributes: {
                // exclude: ["created_at", "updated_at"]
            }
        })

        for (let i = 0; i < edukasi.length; i++) {
            if (edukasi[i].puskesmas_id != null) {
                const puskesmas = await axios.get(`${process.env.URL_PUSKESMAS}/detail/${edukasi[i].puskesmas_id}`)
                edukasi[i].dataValues.puskesmas = puskesmas.data.data.nama
            }
            edukasi[i].dataValues.upload_by = await Users.findOne({
                where: {
                    id: edukasi[i].upload_by
                },
                attributes: {
                    exclude: ["password", "role_id", "puskesmas_id", "email", "created_at", "updated_at"],
                },
                include: [
                    {
                        model: Roles,
                        as: "role",
                        attributes: {
                            exclude: ["id", "created_at", "updated_at"]
                        }
                    }
                ]
            })
        }

        return payload(200, true, "Success get all edukasi", edukasi, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const getEdukasiPerPuskesmas = async (req, res) => {
    const puskesmas_id = req.user.puskesmas_id
    try {
        const edukasi = await Edukasi.findAll({
            where: {
                puskesmas_id: puskesmas_id
            }
        })
        const puskesmas = await axios.get(`${process.env.URL_PUSKESMAS}/detail/${req.user.puskesmas_id}`)

        for (let i = 0; i < edukasi.length; i++) {
            edukasi[i].dataValues.upload_by = await Users.findOne({
                where: {
                    id: edukasi[i].upload_by
                },
                attributes: {
                    exclude: ["password", "role_id", "puskesmas_id", "email", "created_at", "updated_at"],
                },
                include: [
                    {
                        model: Roles,
                        as: "role",
                        attributes: {
                            exclude: ["id", "created_at", "updated_at"]
                        }
                    }
                ]
            })
        }

        const result = {
            puskesmas: puskesmas.data.data.nama,
            edukasi: edukasi
        }

        return payload(200, true, "Success get edukasi per puskesmas", result, res)
    }
    catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const createEdukasi = async (req, res) => {
    try {
        const { judul, isi } = req.body
        const upload_by = req.user.id
        const puskesmas_id = req.user.puskesmas_id

        const slug = judul.toLowerCase().replace(/ /g, "-")

        const edukasi = await Edukasi.create({
            judul: judul,
            slug: slug,
            isi: isi,
            upload_by: upload_by,
            puskesmas_id: puskesmas_id
        })

        const puskesmas = await axios.get(`http://103.141.74.123:81/api/v1/puskesmas/detail/${edukasi.puskesmas_id}`)

        const result = await Edukasi.findOne({
            where: {
                id: edukasi.id
            },
            attributes: {
                exclude: ["upload_by"]
            },
        })
        result.dataValues.puskesmas = puskesmas.data.data.nama

        return payload(200, true, "Success create edukasi", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const detailEdukasi = async (req, res) => {
    try {
        const slug = req.params.slug
        const puskesmas = await axios.get(`${process.env.URL_PUSKESMAS}/detail/${req.user.puskesmas_id}`)
        const edukasi = await Edukasi.findOne({
            where: {
                slug: slug
            },
        })

        edukasi.dataValues.upload_by = await Users.findOne({
            where: {
                id: edukasi.upload_by
            },
            attributes: {
                exclude: ["password", "role_id", "puskesmas_id"]
            },
            include: [
                {
                    model: Roles,
                    as: "role",
                    attributes: {
                        exclude: ["id"]
                    }
                }
            ]
        })

        edukasi.dataValues.puskesmas = puskesmas.data.data
        return payload(200, true, "Success get detail edukasi", edukasi, res)
    }
    catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const updateEdukasi = async (req, res) => {
    try {
        const edukasi = await Edukasi.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!edukasi) {
            return payload(404, false, "Edukasi not found", null, res)
        }

        if (edukasi.upload_by != req.user.id) {
            return payload(401, false, "You are not allowed to update this edukasi", null, res)
        }

        const { judul, isi } = req.body
        const slug = judul.toLowerCase().replace(/ /g, "-")

        await Edukasi.update(
            {
                judul: judul,
                slug: slug,
                isi: isi
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        const update = await Edukasi.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: ["upload_by", "puskesmas_id"]
            }
        })

        return payload(200, true, "Success update edukasi", update, res)

    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const deleteEdukasi = async (req, res) => {
    try {
        const edukasi = await Edukasi.findOne({
            where: {
                id: req.params.id
            }
        })

        if (edukasi.upload_by != req.user.id) {
            return payload(401, false, "You are not allowed to delete this edukasi", null, res)
        }

        await Edukasi.destroy({
            where: {
                id: req.params.id
            }
        })

        return payload(200, true, "Success delete edukasi", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}
