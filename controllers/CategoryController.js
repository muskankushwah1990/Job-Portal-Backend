const CategoryModel = require('../models/category')
const JobModel = require('../models/job')

class CategoryController {

    static insertCategory = async (req, res) => {
        try {
            
            const{name, icon} = req.body
            const result = new CategoryModel({
                name: name,
                icon: icon
            })

            const category =await result.save()

            res.status(200).json({
                success: true, message: "Category insert Successfully",
                category,
            });

        } catch (error) {
            console.log(error)
        }
    }



    static displayCategory = async(req, res) => {
        try {
            const allCategory = await CategoryModel.find()
            res.status(200).json({
                success: true,
                allCategory,
            });
        } catch (error) {
            console.log(error)
        }
    }

    static categoryList = async (req, res) => {
        try {
            const {name} = req.params
            // console.log("category name", name)
            const categoryList = await JobModel.find({category: name})
            // console.log(categoryList)
            if(!categoryList) {
                return res.status(404).json({status: "failed", message: "Category Not Found"})
            }

            res.status(200).json({success: true, categoryList})


        } catch (error) {
            console.log(error)
        }
    }


    
    static viewCategory = async(req, res) => {
        try {
            const {id} = req.params
            const view = await CategoryModel.findById(id)
            res.status(200).json({
                success: true,
                view,
            });
        } catch (error) {
            console.log(error)
        }
    }

    
    static editCategory = async(req, res) => {
        try {
            const {id} = req.params
            console.log(id)
            const editCategory = await CategoryModel.findById(id)
            console.log(editCategory)
            if (!editCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }
            res.status(200).json({
                success: true,
                editCategory,
            });
        } catch (error) {
            console.log(error)
        }
    }

    
    static updateCategory = async(req, res) => {
        try {
            const {id} = req.params
            console.log("update id", id)
            const {name, icon} = req.body
            console.log(name, icon)
            const result = await CategoryModel.findByIdAndUpdate(id, {
                name: name,
                icon: icon
            })
            console.log(result)
            res.status(200).json({
                success: true, message: "Category updated successfully",
                result,
            });
        } catch (error) {
            console.log(error)
        }
    }


    static deletedCategory = async(req, res) => {
        try {
            const {id} = req.params
            console.log(id)
           const deleteCategory = await CategoryModel.findByIdAndDelete({id})
            res.status(200).json({
                success: true, message: "Category Deleted",
                deleteCategory,
            });
        } catch (error) {
            console.log(error)
        }
    }









}

module.exports = CategoryController;