import WeeklyFoodMenu from "../model/WeeklyFoodMenu.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async (req,res) => {
    console.log("In WeeklyFoodMenu Controller..");
    console.log("req id =>",req.params.id);
    console.log("req data =>",req.body);

    try{
        const {weekdays, foodType, foodDescription} = req.body;

        const data = await User.findById({_id : req.params.id});
        console.log("data==>",data,"==>",data.hostelId);
        
        let newFoodMenu = new WeeklyFoodMenu({
            hostelId : data.hostelId,
            weekdays,
            foodType,
            foodDescription,
            createdBy : req.params.id,
        });
        await newFoodMenu.save(); 

        console.log("newFoodMenu=>",newFoodMenu);
        res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});

    }catch(error){
        console.log("Error Found While add Data",error);
        res.status(500).json({ message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req,res) => {
    console.log("In WeeklyFoodMenu Controller..");
    console.log("Id =>",req.params.id);

    try{
        let result = await WeeklyFoodMenu.find({createdBy : req.params.id, deleted : false});
        console.log("result==>",result);

        let total_recodes = await WeeklyFoodMenu.countDocuments({createdBy : req.params.id, deleted : false});
        console.log("total_recodes==>",total_recodes);

        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }   
}

export default {add, index };

