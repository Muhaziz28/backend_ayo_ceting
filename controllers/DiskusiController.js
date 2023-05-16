import Diskusi from "../models/DiskusiModel.js"
import Pengajuan from "../models/PengajuanModel.js"
import Users from "../models/UserModel.js"
import payload from "../response_format.js"

export const getAllDiskusi = async (req, res) => {
    try {
        const diskusi = await Diskusi.findAll({
            where: {
                pengajuan_id: req.params.id
            },
        })
        if (diskusi.length == 0) {
            return payload(404, false, "Belum ada diskusi", null, res)
        }
        return payload(200, true, "Diskusi retrieved", diskusi, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const sendDiskusi = async (req, res) => {
    try {
        const pengajuan_id = req.params.id
        const { to_user_id, from_user_id, isi_diskusi } = req.body

        const checkPengajuanStatus = await Pengajuan.findOne({
            where: { id: pengajuan_id }
        })
        if (!checkPengajuanStatus) {
            return payload(404, false, "Pengajuan tidak ditemukan", null, res)
        }
        if (checkPengajuanStatus.discussion_status == false) {
            return payload(400, false, "Diskusi tidak aktif atau belum di approve", null, res)
        }

        const diskusi = await Diskusi.create({
            pengajuan_id: pengajuan_id,
            to_user_id: to_user_id,
            from_user_id: from_user_id,
            isi_diskusi: isi_diskusi
        })
        return payload(200, true, "Diskusi sent", diskusi, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}