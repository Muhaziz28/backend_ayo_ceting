import Pengajuan from "../models/PengajuanModel.js"
import VonisAwal from "../models/VonisAwalModel.js"
import payload from "../response_format.js"

export const createVonisAwal = async (req, res) => {
    try {
        const pengajuan_id = req.params.id
        const { vonis } = req.body

        const chekPengajuan = await Pengajuan.findOne({
            where: { id: pengajuan_id }
        })
        if (!chekPengajuan) {
            return payload(404, false, "Pengajuan tidak ditemukan", null, res)
        }
        const checkVonisAwal = await VonisAwal.findOne({
            where: { pengajuan_id: pengajuan_id }
        })
        if (checkVonisAwal) {
            return payload(400, false, "Vonis awal sudah dibuat", null, res)
        }
        const vonisAwal = await VonisAwal.create({
            pengajuan_id: pengajuan_id,
            vonis: vonis
        })

        //discussion_status = false
        await chekPengajuan.update({
            discussion_status: false
        })

        return payload(200, true, "Vonis awal created", vonisAwal, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}