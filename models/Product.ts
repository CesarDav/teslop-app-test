import { IProduct } from 'interfaces';
import mongoose, { Schema, model, Model } from 'mongoose';


const productShema = new Schema({
    description: { type: String, required: true, default: '' },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: '{VALUE} not a permitted size'
        }
    }],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true, default: '' },
    type: {
        type: String,
        enum: {
            values: ['shirts', 'pants', 'hoodies', 'hats'],
            message: '{VALUE} not a valid type '
        },
        default: 'shirts'

    },
    gender: {
        type: String,
        enum: {
            values: ['men', 'women', 'kid', 'unisex'],
            message: `{VALUE} is not a valid gender`
        },
        default: 'men'
    }
}, {
    timestamps: true
})

productShema.index({ title: 'text', tags: 'text' })


const Product: Model<IProduct> = mongoose.models.Product || model('Product', productShema);


export default Product
