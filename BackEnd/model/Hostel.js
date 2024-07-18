import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema({
    hostelName : { type: String, required: true },
    phoneNumber : { type: Number, required: true },
    email : { type: String, required: true },
    noOfRoom : { type: Number, required: true },
    uniqueCode : { type: String, required: true, unique: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    photo: { type: [String] },
    availableBeds : {type: Number, require:true, default: 0 },
    deleted: { type: Boolean, default: false },
    isAdmin: { type: String, default: false }
});

export default mongoose.model("Hostel",HostelSchema);

