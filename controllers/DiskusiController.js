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
            include: [
                {
                    model: Users,
                    as: "user",
                },
                {
                    model: Pengajuan
                }
            ],
        })
        return payload(200, true, "Diskusi retrieved", diskusi, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}