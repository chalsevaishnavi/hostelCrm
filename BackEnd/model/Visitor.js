import mongoose from "mongoose";
import User from "./User.js";

const VisitorSchema = new mongoose.Schema({
    hostelId: { type: String, required: true },
    studentName : { type: String, required: true },
    visitorName : { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    dateTime : { type: Date, required: true },
    deleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: User,
    }
});

export default mongoose.model('Visitor',VisitorSchema);

