const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, require: true, unique: true},
        desc: {type: String, require: true},
        img: {type: String, require: true},
        categories: {type: String, Array},
        size: {type: String},
        color: {type: String},
        price: {type: Number, require: true}, 
        
    },
    {timestamps: true}
);


module.export = mongoose.model("Product", ProductSchema);