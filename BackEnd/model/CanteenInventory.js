import mongoose from 'mongoose';
import User from './User.js';

const CanteenInventorySchema = new mongoose.Schema({
    hostelId      : { type: String, required: true },
    productName : { type: String, required: true },
    mesurment   : { type: String, required: true },
    deleted: { type: Boolean, default: false },
    createdBy     : {
        type: mongoose.Schema.ObjectId,
        ref:  User
    }
});

export default mongoose.model('CanteenInventory',CanteenInventorySchema);