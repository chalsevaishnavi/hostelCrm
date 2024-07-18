import Hostel from "../model/Hostel.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async (req, res) => {
    console.log("In hostel controller");
    console.log("Data =>", req.body);
    console.log("Hos Img =>", req.files);
    try {
        const { hostelName, phoneNumber, email, noOfRoom, uniqueCode, state, city, address } = req.body;

        const existingEmail = await Hostel.findOne({ email });

        if (existingEmail) {
            console.log("Email is Already Exist!!");
            res.status(401).json({ message: messages.EMAIL_ALREADY_EXISTS });
            return;
        }

        const fileNames = req.files.map(file => file.filename);

        const newHostel = new Hostel({
            hostelName,
            phoneNumber,
            email,
            noOfRoom,
            uniqueCode,
            state,
            city,
            address,
            photo: fileNames
        });
        await newHostel.save();
        res.status(201).json({message: messages.DATA_SUBMITED_SUCCESS });
    } catch (error) {
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
}

const index = async (req, res) => {
  try {
      let result = await Hostel.find({ deleted: false });
      console.log("Result =>", result);
      let total_recodes = await Hostel.countDocuments({deleted : false});
      console.log("total_recodes==>",total_recodes);
      res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
  } catch (error) {
      console.log("Error =>", error);
      res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
}

const view = async (req, res) => {
    console.log("In View");
    console.log("uniqueCode: ", req.params.uniqueCode);
    try {
      const result = await Hostel.findOne({ uniqueCode: req.params.uniqueCode });
      console.log("result ==>", result);
      if (!result) {
        return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
      }
      res.status(200).json({result, message : messages.DATA_FOUND_SUCCESS});
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
}
  
const edit = async (req, res) => {
    console.log("In edit");
    console.log("id", req.params.uniqueCode);

    const fileNames = req.files.map(file => file.filename);

    try{
        const result = await Hostel.updateOne(
            {uniqueCode : req.params.uniqueCode},
            {
                $set : {
                    hostelName : req.body.hostelName,
                    phoneNumber : req.body.phoneNumber,
                    email : req.body.email,
                    noOfRoom : req.body.noOfRoom,
                    // uniqueCode : req.body.uniqueCode,
                    state : req.body.state,
                    city : req.body.city,
                    address : req.body.address,
                    photo : fileNames,
                }
            }
        );
        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
    }catch(error){
        console.log("Found Error While Update", error);
        res.status(400).json({message : messages.DATA_UPDATED_FAILED});
    }
}

const deleteData = async (req, res) => {
  try {
      console.log("In deleteData");
      console.log("Id:", req.params.id);

      const hostel = await Hostel.findOne({ uniqueCode: req.params.id });
      if (!hostel) {
          return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
      } else {
          await Hostel.findOneAndUpdate({ uniqueCode: req.params.id }, { deleted: true });
          console.log("Hostel deleted successfully !!");
          res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
      }
  } catch (error) {
      console.log("Error =>", error);
      res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
}

const roomsCount = async (req, res) => {
    console.log("In roomCount Id=>",req.params.id);
    
    try{
       console.log("try block");
       let data = await User.findByIdAndUpdate({_id : req.params.id});
       console.log("Found Admin==>",data);

       let hostel = data.hostelId;

       let hostelData = await Hostel.findOne({uniqueCode : hostel});
       console.log("hostelData=>",hostelData);

       let noOfRooms = hostelData.noOfRoom;

       res.status(200).send({ noOfRooms, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
}

const bedsCount = async (req, res) => {
    try{
        console.log("In try Id=>", req.params.id);

        let data = await User.findById({_id : req.params.id});
        console.log(" admin data=>",data);

        let hostelId = data.hostelId;

        let hostelData = await Hostel.findOne({uniqueCode : hostelId});
        console.log("hostelData =>",hostelData);

        let avabeds = hostelData.availableBeds;
        console.log("avabeds=>",avabeds);

        res.status(200).send({ avabeds, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
}




export default {add, index, view, edit, deleteData, roomsCount, bedsCount };







