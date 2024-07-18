import mongoose from "mongoose";
import User from "./User.js";

const NoticeBoardSchema = new mongoose.Schema({
    hostelId    : { type : String, require : true },
    noticeTitle : {type : String, require : true},
    description : {type : String, require : true},
    dateTime    : {type : Date, require : true},
    deleted     : {type : Boolean, default : false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: User,
    }
}); 

export default mongoose.model('NoticeBoard',NoticeBoardSchema);
