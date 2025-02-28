import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
    userId: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    accountNumber: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;