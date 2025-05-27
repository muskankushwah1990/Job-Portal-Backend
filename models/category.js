const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        icon: {
            type: String,
            require: true
        }
    },
    {timestamps: true}
)

const CategoryModel = mongoose.model("Category", CategorySchema)
module.exports = CategoryModel;