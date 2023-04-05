import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Roles = db.define(
	"roles",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		role_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	},
	{
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
)

export default Roles