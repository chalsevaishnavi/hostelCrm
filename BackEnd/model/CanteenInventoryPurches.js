import mongoose from 'mongoose';
import User from './User.js';

const CanteenInventoryPurchesSchema = new mongoose.Schema({
    hostelId    : { type : String, require : true },
    productName : { type : String, require : true },
    quantity    : { type : Number, require : true },
    price       : { type : String, require : true },
    date        : { type : Date, require : true },
    deleted     : { type : Boolean, default : false},  
    createdBy     : {
        type: mongoose.Schema.ObjectId,
        ref:  User
    }

});
export default mongoose.model('CanteenInventoryPurches',CanteenInventoryPurchesSchema );
