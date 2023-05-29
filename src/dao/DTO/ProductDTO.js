export default class ProductDTO {

    static getInsertDTO = (product) =>{
        //Asegurarme que lo que inserte en la base de datos COINCIDA en lo que me pide.
        return {
            title: product.title,
            description: product.description,
            price: product.price,
            code: product.code,
            category: product.category || 'No category',
            image: product.image || 'url de imagen genérica'
        };
    };
};