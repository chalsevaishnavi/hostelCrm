import mongoose from 'mongoose';
import User from "./User.js";

const WeeklyFoodSchema = new mongoose.Schema({
    hostelId : {type : String, require : true},
    weekdays : {type : String, require : true},
    foodType : {type : String, require : true},
    foodDescription : {type : String, require : true},
    deleted : {type : Boolean, default : false},
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: User,
    }

});
export default mongoose.model('WeeeklyFoodMenu', WeeklyFoodSchema);

