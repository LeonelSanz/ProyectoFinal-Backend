import { productsService } from "../dao/index.js";

const createProduct = async(req,res)=>{
    const file = req.file;
    const  {title, description, code, price, category, stock} = req.body;
    if(!title || !description || !code || !price || !stock)
        return res
            .status(400)
            .send({status: "error", error: "Incomplete values"});
    const product = {
        title,
        description,
        code,
        price,
        category,
        stock,
        image:`${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`
    };
    const result = await productsService.createProduct(product);
    res.send({status: "success", payload: result})
}

const getProducts = async(req,res) =>{
    const products = await productsService.getProduts();
    res.send({status: "success", payload: products});
}

export default {
    createProduct,
    getProducts
}