import StudentReservation from "../model/StudentReservation.js";
import Hostel from "../model/Hostel.js";
import User from "../model/User.js";
import studentcomplaint from "./studentcomplaint.js";
import StudentReg from "../model/StudentReg.js";
import messages from "../constants/message.js";


const add = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("Req Data =>",req.body);
    console.log("Admin Id =>",req.params.id);

    try{
        const { studentHosId, 
                roomNumber, 
                startDate, 
                endDate, 
                isLibrary, 
                isFood, 
                libraryAmount, 
                foodAmount, 
                hostelFeeAmount,
                advancedDepositAmount, 
                depositAmount, 
                dateTimeDeposit,
                paymentMethod,
               } = req.body;

        const  totalFeeAmount = Number(libraryAmount) + Number(foodAmount) + Number(hostelFeeAmount) ;
        const  remaningAmount = totalFeeAmount - Number(depositAmount);

        const data = await StudentReg.findOne({studentHosId : req.body.studentHosId});
         console.log("Data=>",data);

        const hostelId = data.hostelId;
        console.log("hostelId =>",hostelId);

        const studentName = data.firstname +" "+ data.lastname ;
        console.log("studentName =>",studentName);

        // const data1  = await Hostel.findOne({uniqueCode : hostelId});
        // console.log("data1=>",data1);

        const hostelName = data.hostelname;
        console.log("hostelName=>",hostelName);

        const newReservation = new StudentReservation({
            studentHosId, 
            hostelId, 
            studentName, 
            hostelName, 
            roomNumber, 
            startDate, 
            endDate,
            isLibrary, 
            isFood,  
            libraryAmount, 
            foodAmount, 
            hostelFeeAmount,
            totalFeeAmount, 
            advancedDepositAmount, 
            depositAmount, 
            remaningAmount,
            dateTimeDeposit,
            paymentMethod,
            createdBy : req.params.id,
        }); 
        console.log("newReservation =>",newReservation);

        await newReservation.save();
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});
        
    }catch(error){
        console.log("Error Found =>", error);
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
} 

const index = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("In Index id==>",req.params.id);

    try{
        let result = await StudentReservation.find({deleted : false, createdBy : req.params.id});
        console.log("All list filter with created by ===>",result);
        let total_recodes = await StudentReservation.countDocuments({deleted : false, createdBy : req.params.id});
        console.log("total_recodes==>",total_recodes);
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
     
}

const view = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("Id =>",req.params.id);

    try{
        let result = await StudentReservation.findOne({studentHosId : req.params.id});
        if(!result){
            return res.status(404).json({message : messages.DATA_NOT_FOUND});
        }
        console.log("result =>",result);
        res.status(200).json({result, message : messages.DATA_FOUND_SUCCESS});
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
} 

const edit = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("Id =>",req.params.id);

    try {
        // totalFeeAmount
        const totalFeeAmount = Number(req.body.libraryAmount) + Number(req.body.foodAmount) + Number(req.body.hostelFeeAmount);
        // remaningAmount
        const depositAmount = Number(req.body.depositAmount);
        const remaningAmount = totalFeeAmount - depositAmount;
    
        let result = await StudentReservation.updateOne(
            {studentHosId: req.params.id},
            {
                $set: {
                    // studentHosId: req.body.studentHosId,
                    roomNumber: req.body.roomNumber,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    isLibrary: req.body.isLibrary,
                    isFood: req.body.isFood,
                    libraryAmount: req.body.libraryAmount,
                    foodAmount: req.body.foodAmount,
                    hostelFeeAmount: req.body.hostelFeeAmount,
                    totalFeeAmount: totalFeeAmount, 
                    advancedDepositAmount: req.body.advancedDepositAmount,
                    depositAmount: depositAmount, 
                    remaningAmount: remaningAmount, 
                    dateTimeDeposit: req.body.dateTimeDeposit,
                    paymentMethod: req.body.paymentMethod,
                }
            }
        );

        console.log("Updated Result =>",result);

        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
    } catch (error) {
        console.log("Found Error While Updating User", error);
        res.status(400).json({message : messages.DATA_UPDATED_FAILED});
    }
    
}

const deleteData = async (req, res) => {
    try{
        console.log("In  StudentReservation controller");
        console.log("Id:",req.params.id);
        const result = await StudentReservation.findOne({studentHosId : req.params.id});
        console.log("result=>",result);

        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
          await StudentReservation.findOneAndUpdate({studentHosId : req.params.id},{deleted : true});
          console.log("Student Details deleted successfully !!");
          res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
        }
      }catch(error){
        console.log("Error =>", error);
      res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}

export default {add, view, index, edit, deleteData};








