import CanteenInventoryConsume from "../model/CanteenInventoryConsume.js";
import Hostel from "../model/Hostel.js";
import CanteenInventoryPurches from "../model/CanteenInventoryPurches.js";
import User from "../model/User.js";
import messages from "../constants/message.js";

const add = async (req, res) => {
    console.log("In CanteenInventoryConsume Controller..");
    console.log("Req Id =>",req.params.id);
    console.log("Req Body =>",req.body);

    try{
        const {productName, quantity, date} = req.body;

        const data = await User.findById({_id : req.params.id});
        console.log("data==>",data,"==>",data.hostelId);

        let data1 = await CanteenInventoryPurches.findOne({productName : req.body.productName});
        const remaning = data1.quantity - Number(req.body.quantity);
       
        const newConsume = new CanteenInventoryConsume({
            hostelId : data.hostelId,
            productName, 
            quantity, 
            remaning, 
            date,
            createdBy : req.params.id,
        });
        await newConsume.save();
        console.log("newConsume==>",newConsume);
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});

    }catch(error){
        console.log('Error Found While Add Data',error);
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req, res) => {
    console.log("In CanteenInventoryConsume Controller..");
    console.log("Id =>", req.params.id);

    try{
        let result = await CanteenInventoryConsume.find({createdBy : req.params.id,deleted : false});
        console.log("result=>",result);
        let total_recodes = await CanteenInventoryConsume.countDocuments({createdBy : req.params.id,deleted : false});
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
}

const view = async (req, res) => {
    console.log("In CanteenInventoryConsume Controller..");
    console.log("Id=>", req.params.id);

    let result = await CanteenInventoryConsume.findById({_id : req.params.id});
    console.log("result=>",result);

    if(!result){
        return res.status(404).json({message : "Product is not Found.."});
    }
    res.status(200).json(result);
}

const edit = async (req, res) => {
    console.log("In CanteenInventoryConsume Controller..");
    console.log("Id=>", req.params.id);

    const data = await CanteenInventoryConsume.findOne({productName : req.body.productName}); 
    console.log("data=>",data);

    const rem = data.remaning - Number(req.body.quantity); 
    console.log("rem ", rem);

    try{
        let result = await CanteenInventoryConsume.updateOne(
            {_id : req.params.id},
            {
                $set : {
                    quantity : req.body.quantity,
                    remaning :  rem,
                    date : req.body.date
                }
            }
        );
        console.log("result==>",result);
        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
        
    }catch(error){
        console.log("Found Error While Update", error);
        res.status(400).json({message : messages.DATA_UPDATED_FAILED});
    }
}

const deleteData = async (req, res) => {
    console.log("In CanteenInventoryConsume Controller..");
    console.log("Id=>", req.params.id);

    try{
        let result = await CanteenInventoryConsume.findById({_id : req.params.id});
        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
            await CanteenInventoryConsume.findByIdAndUpdate({_id : req.params.id},{deleted : true});
            console.log("Product Details deleted successfully !!");
            res.json({message : "Product Details deleted successfully !!"});
        }
    }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}


export default { add, index, view, edit, deleteData};
