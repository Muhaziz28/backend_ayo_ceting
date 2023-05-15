import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import Pengajuan from "./PengajuanModel.js"
import Users from "./UserModel.js"

const { DataTypes } = Sequelize
const Diskusi = db.define(
    "diskusi",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pengajuan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        from_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isi_diskusi: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    },
    {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)


Pengajuan.hasMany(Diskusi, { foreignKey: "pengajuan_id" })
Diskusi.belongsTo(Pengajuan, { foreignKey: "pengajuan_id" })

Users.hasMany(Diskusi, { foreignKey: "from_user_id" })
Diskusi.belongsTo(Users, { foreignKey: "from_user_id" })

Users.hasMany(Diskusi, { foreignKey: "to_user_id" })
Diskusi.belongsTo(Users, { foreignKey: "to_user_id" })

export default Diskusi