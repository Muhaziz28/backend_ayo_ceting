import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import CategoryPengajuan from "./CategoryPengajuanModel.js"

const { DataTypes } = Sequelize

const Pengajuan = db.define(
    "pengajuan",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isi_pengajuan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        category_pengajuan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lokasi: {
            type: DataTypes.GEOMETRY,
            allowNull: false,
        },
        alamat_lengkap: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
    {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

CategoryPengajuan.hasMany(Pengajuan, { foreignKey: "category_pengajuan_id" })
Pengajuan.belongsTo(CategoryPengajuan, { foreignKey: "category_pengajuan_id" })

export default Pengajuan