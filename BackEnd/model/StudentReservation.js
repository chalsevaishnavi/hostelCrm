import mongoose from "mongoose";
import Hostel from "../model/Hostel.js";
import User from "./User.js";

const StudentRevSchema = new mongoose.Schema({
    studentHosId : { type: String, required: true },
    hostelId     : { type: String, required: true,  ref: Hostel},
    studentName : { type: String, required: true },
    hostelName : { type: String, required: true },
    roomNumber : { type: Number, required: true },
    startDate : { type: Date, required: true },
    endDate : { type: Date, required: true },
    isLibrary : { type: Boolean, default: false },
    isFood : { type: Boolean, default: false },
    libraryAmount : { type: Number, required: false},
    foodAmount : { type: Number, required: false },
    hostelFeeAmount : { type: Number, required: true},
    totalFeeAmount : { type: Number, required: true },
    advancedDepositAmount : { type: Number, required: true },
    depositAmount : { type: Number, required: true },
    remaningAmount : { type: Number, required: true },
    dateTimeDeposit : { type: Date, required: true },
    paymentMethod : { type: String, required: true },
    deleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: User
    }
});

export default mongoose.model("ReserveStudent",StudentRevSchema);
