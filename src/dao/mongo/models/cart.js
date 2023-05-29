import mongoose from "mongoose";

const collection = 'Carts';

const schema = new mongoose.Schema({
    products:[
        {
            _id:{
                type: mongoose.SchemaTypes.ObjectId,
                ref:'Products'
            },
            qty:{
                type: Number,
                default: 1
            }
        }
    ]
})

const cartModel = mongoose.model(collection,schema);

export default cartModel;