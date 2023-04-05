import CategoryPengajuan from "../models/CategoryPengajuanModel.js";
import Roles from "../models/CategoryPengajuanModel.js"
import payload from "../response_format.js"

export const getAllCategoryPengajuan = async (req, res) => {
    try {
        const category_pengajuan = await CategoryPengajuan.findAll()
        const result = category_pengajuan.map((category) => {
            return {
                id: category.id,
                category_name: category.category_name
            }
        })
        return payload(200, true, "Success", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const getCategoryPengajuanById = async (req, res) => {
    try {
        const { id } = req.params;
        const category_pengajuan = await CategoryPengajuan.findOne({
            where: {
                id: id
            }
        });
        if (!category_pengajuan) {
            return payload(404, false, "Category not found", null, res)
        }
        const result = {
            id: category_pengajuan.id,
            category_name: category_pengajuan.category_name
        }
        return payload(200, true, "Success", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const createCategoryPengajuan = async (req, res) => {
    try {
        const { category_name } = req.body;
        const categoryExist = await CategoryPengajuan.findOne({
            where: {
                category_name: category_name
            }
        });
        if (categoryExist) {
            return payload(400, false, "Category already exist", null, res)
        }
        const category_pengajuan = await CategoryPengajuan.create({
            category_name: category_name
        });
        return payload(200, true, "Category created", category_pengajuan, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const updateCategoryPengajuan = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;
        const category_pengajuan = await CategoryPengajuan.findOne({
            where: {
                id: id
            }
        });
        if (!category_pengajuan) {
            return payload(404, false, "Category not found", null, res)
        }
        if (category_name === category_pengajuan.category_name) {
            return payload(400, false, "Category name is the same", null, res)
        }
        await Roles.update(
            {
                category_name: category_name
            },
            {
                where: {
                    id: id
                }
            }
        )
        const result = await CategoryPengajuan.findOne({
            where: {
                id: id
            }
        });
        return payload(200, true, "Category updated", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const deleteCategoryPengajuan = async (req, res) => {
    try {
        const { id } = req.params;
        const category_pengajuan = await CategoryPengajuan.findOne({
            where: {
                id: id
            }
        })
        if (!category_pengajuan) {
            return payload(404, false, "Category not found", null, res)
        }
        await CategoryPengajuan.destroy({
            where: {
                id: id
            }
        })
        return payload(200, true, "Category deleted", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}