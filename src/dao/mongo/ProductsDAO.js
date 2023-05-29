import productsModel from "./models/product.js";


export default class ProductsDao {

    getProducts = (params,page=1) => {
        return productsModel.paginate(params, {page, limit: 12, lean: true});
    };

    getProductById = (id) => {
        return productsModel.findOne({_id: id}).lean();
    };

    createProduct = (product) => {
        return productsModel.create(product);
    };

    updateProduct = (id, product) => {
        return productsModel.findByIdAndUpdate(id, {$set: product});
    };
};