import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    hostelId: { type: String, required: true },
    roomNumber: { type: Number, required: true },
    numOfBeds: { type: Number, required: true },
    occupiedBeds: { type: Number, required: true },
    roomType: { type: String, required: true },
    roomRent: { type: Number, required: true },
    remainingBeds: { type: Number, required: true },
    photo: { type: [String] },
    availability: { type: String, required: true, enum: ['available', 'unavailable'], default: 'available' },
    deleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

// Add a compound index to enforce unique room numbers within each hostel
RoomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model('Room', RoomSchema);


