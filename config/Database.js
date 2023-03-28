import { Sequelize } from "sequelize";

const db = new Sequelize("ayo_ceting", "root", "", {
	host: "localhost",
	dialect: "mysql"
})

export default db;