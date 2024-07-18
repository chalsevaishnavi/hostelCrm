import messages from "../constants/message.js";
import Room from "../model/Room.js";
import User from "../model/User.js"
import Hostel from "../model/Hostel.js";

const add = async (req,res) => {
    console.log("In room controller..");
    console.log("Req Id =>",req.params.id);
    console.log("Req Data =>",req.body);
    console.log("Req File Data =>",req.files);

    try{
        const {roomNumber, numOfBeds, occupiedBeds,roomType,roomRent} = req.body;
        const fileNames = req.files.map(file => file.filename);
        console.log("fileNames==>",fileNames);

        const data = await User.findById({_id : req.params.id});
        console.log("data==>",data,"==>",data.hostelId);

        const HostelId = data.hostelId;
        console.log("HostelId==>",HostelId);

        const remainingBeds = Number(numOfBeds)-Number(occupiedBeds); 
        console.log("remainingBeds==>",remainingBeds);

        // Calculate availability
        const availability = remainingBeds > 0 ? 'available' : 'unavailable';

        const roomData = new Room({
            hostelId : data.hostelId,
            roomNumber,
            numOfBeds,
            occupiedBeds,
            roomType,
            roomRent,
            remainingBeds,
            photo : fileNames,
            availability, // Add the availability field
            createdBy : req.params.id
        });
        await roomData.save();

         // Update availableBeds in Hostel document
         const rooms = await Room.find({ hostelId: data.hostelId, deleted: false });
         console.log("rooms==>",rooms);

        const totalAvailableBeds = rooms.reduce((sum, room) => sum + room.remainingBeds, 0);
        console.log("totalAvailableBeds==>",totalAvailableBeds);

        const hosdata = await Hostel.findOneAndUpdate({uniqueCode : HostelId},{ availableBeds : totalAvailableBeds });
        console.log("hosdata==>",hosdata);
        
        console.log("roomData =>",roomData);
        res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});
    }catch (error) {
        if (error.code === 11000) {
            
            // Handle duplicate...
            console.log("Duplicate key error:", error);
            res.status(400).json({ message: "Room number already exists in this hostel." });
        } else {
            console.log("Error Found While add rooms", error);
            res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
        }
    }
}

const index = async (req,res) => {
    console.log("In room controller..");
    console.log("Req Id=>",req.params.id);

    try{
        let result = await Room.find({deleted : false, createdBy : req.params.id});
        console.log("result===>",result);

        let total_recodes = await Room.countDocuments({deleted : false, createdBy : req.params.id});
        console.log("total_recodes==>",total_recodes);

        let availableRooms = await Room.countDocuments({ deleted: false, createdBy: req.params.id, availability: 'available' });
        console.log("availableRooms==>", availableRooms);


        res.status(200).send({ result, totalRecodes: total_recodes, availableRooms, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
}

const view = async (req,res) => {
    console.log("In room controller..");
    console.log("Id :",req.params.id);

    try{
        const result = await Room.findOne({roomNumber : req.params.id});
        console.log("result",result);
        if(!result){
            return res.status(404).json({message : messages.DATA_NOT_FOUND});
        }
        res.status(200).json({result, message : messages.DATA_FOUND_SUCCESS});
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
}

const edit = async (req,res) => {
    console.log("In room controller Edit..");
    console.log("Id =>",req.params.id);
    
    try{
        const remainingBeds = Number(req.body.numOfBeds)-Number(req.body.occupiedBeds); 
        const fileNames = req.files.map(file => file.filename);
        const availability = remainingBeds > 0 ? 'available' : 'unavailable';

        let result = await Room.updateOne(
            {roomNumber : req.params.id},
            {
                $set : {
                    roomType : req.body.roomType,
                    numOfBeds : req.body.numOfBeds,
                    occupiedBeds : req.body.occupiedBeds,
                    roomRent : req.body.roomRent,
                    remainingBeds : remainingBeds,
                    availability : availability,
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

const deleteData = async (req,res) => {
    console.log("In room controller deleteData ..");
    console.log("Id:",req.params.id);
    try{
        const result = await Room.findOne({roomNumber : req.params.id});
        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
          await Room.findOneAndUpdate({roomNumber : req.params.id},{deleted : true});
          console.log("Room Details deleted successfully !!");
          res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
        }
      }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}


const countRooms = async (req,res) => {
    try{
        const roomRecords = await Room.countDocuments({deleted : false});
        console.log("roomRecords==>",roomRecords);
        res.status(200).json({roomRecords, message : messages.DATA_FOUND_SUCCESS});

    }catch(error){
        console.log("Error =>", error);
        res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });

    }
}

const calculateBeds = async (req, res) => {
    try {
        console.log("In calculateBeds...");

        // Fetch all hostels
        const hostels = await Hostel.find({});
        console.log("hostels =>", hostels);

        // Store hostel unique codes (IDs) in an array
        let hostelIds = hostels.map(hostel => hostel.uniqueCode);
        console.log("hostelIds =>", hostelIds);

        let hostelNames = hostels.map(hostel => hostel.hostelName);
        console.log("hostelNames =>",hostelNames);

        // Initialize an array to store data for each hostel
        let hostelsData = [];

        // Iterate through each hostel ID
        for (let hostelId of hostelIds) {
            // Fetch rooms for the current hostel using the uniqueCode (hostelId) that are not deleted
            const rooms = await Room.find({ hostelId : hostelId, deleted: false });
            console.log(`Rooms for Hostel ID ${hostelId} =>`, rooms);

            // Initialize counts for the current hostel
            let totalBeds = 0;
            let totalOccupiedBeds = 0;

            // Calculate totals for the current hostel
            for (let room of rooms) {
                totalBeds += room.numOfBeds;
                totalOccupiedBeds += room.occupiedBeds;
            }

            // Calculate available beds for the current hostel
            const totalAvailableBeds = totalBeds - totalOccupiedBeds;

            // Prepare data for the current hostel
            const hostelData = {
                TotalBeds: totalBeds,
                TotalOccupiedBeds: totalOccupiedBeds,
                TotalAvailableBeds: totalAvailableBeds
            };

            // Push current hostel data to the array
            hostelsData.push(hostelData);
        }

        console.log("hostelsData ====>", hostelsData);

        // Respond with the array of hostel data and hostel IDs
        res.status(200).json({ hostelsData, hostelNames, message: "Data found successfully." });
    } catch (error) {
        console.error("Error calculating beds:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



export default {add, index, view, edit, deleteData, countRooms, calculateBeds };