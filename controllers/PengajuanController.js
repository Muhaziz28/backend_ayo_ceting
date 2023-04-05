import { Sequelize } from "sequelize"
import CategoryPengajuan from "../models/CategoryPengajuanModel.js"
import Pengajuan from "../models/PengajuanModel.js"
import payload from "../response_format.js"
import Device from "../models/DeviceModel.js"

export const getAllPengajuan = async (req, res) => {
    try {
        const pengajuan = await Pengajuan.findAll({
            include: [
                {
                    model: CategoryPengajuan,
                    as: "category_pengajuan",
                    attributes: ["category_name"],
                },
            ],
            attributes: [
                "id", "isi_pengajuan", "lokasi", "alamat_lengkap", "status", "created_at",
            ]
        })
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
                }
            ]
        })
        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const createPengajuan = async (req, res) => {
    try {
        const { isi_pengajuan, category_pengajuan_id, lokasi, alamat_lengkap, serial_number } = req.body
        const coordinates = Sequelize.fn('ST_GeomFromText', `POINT(${lokasi.longitude} ${lokasi.latitude})`)

        const device = await Device.findOne({
            where: {
                serial_number: serial_number
            }
        })
        if (!device) {
            await Device.create({
                serial_number: serial_number,
            })
        }

        const getDevice = await Device.findOne({
            where: {
                serial_number: serial_number
            }
        })

        const pengajuan = await Pengajuan.create({
            isi_pengajuan: isi_pengajuan,
            category_pengajuan_id: category_pengajuan_id,
            lokasi: coordinates,
            alamat_lengkap: alamat_lengkap,
            device_id: getDevice.id
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
        pengajuan.status = "approved"
        await pengajuan.save()
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
        pengajuan.status = "rejected"
        await pengajuan.save()
        return payload(200, true, "Pengajuan berhasil di reject", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const getPengajuanByDevice = async (req, res) => {
    try {
        const device = await Device.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!device) {
            return payload(404, false, "Device tidak ditemukan", null, res)
        }

        const pengajuan = await Pengajuan.findAll({
            where: {
                device_id: device.id
            },
            include: [
                {
                    model: CategoryPengajuan,
                    as: "category_pengajuan",
                    attributes: ["category_name"],
                },
            ],
            attributes: [
                "id", "isi_pengajuan", "lokasi", "alamat_lengkap", "status", "created_at",
            ]
        })


        return payload(200, true, "Success", pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}