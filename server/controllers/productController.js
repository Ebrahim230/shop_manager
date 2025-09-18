const Product = require('../models/productModel');

const addProduct = async(req,res)=>{
    try{
        const {name,buyingPrice,sellingPrice,stock,expiryDate}=req.body;
        const newProduct = new Product({
            name,
            buyingPrice,
            sellingPrice,
            stock,
            expiryDate
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
}

const getAllProducts = async(req,res)=>{
    try{
        const products = await Product.find().sort({createdAt: -1});
        res.json(products);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

const updateProduct = async(req,res)=>{
    try{
        const {id} = req.params;
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updateProduct);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

const deleteProduct = async(req,res)=>{
    try{
        const {id} = req.params;
        await Product.findByIdAndDelete(id);
        res.json(
            {
                message: 'Product deleted successfully.'
            }
        )
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
};

module.exports = {addProduct,getAllProducts,updateProduct,deleteProduct};