import mongoose from 'mongoose';
import mongoosePagination  from 'mongoose-paginate-v2';

const collection = 'Products';

const schema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    category:String,
    code:{
        type:String,
        unique:true
    },
    stock: Number,
    image:String
})
schema.plugin(mongoosePagination);

const productsModel  = mongoose.model(collection,schema);

export default productsModel;