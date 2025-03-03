import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    image: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
    },
    category: { type: String, required: true,},
    price: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;