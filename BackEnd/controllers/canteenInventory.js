import CanteenInventory from "../model/CanteenInventory.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("req id=>",req.params.id);
    console.log("req data=>",req.data);

    try{
        const { productName, mesurment } = req.body;

        const data = await User.findById({_id : req.params.id});
        console.log("data==>",data,"==>",data.hostelId);

        const newInventory = new CanteenInventory({
            hostelId : data.hostelId,
            productName,
            mesurment,
            createdBy : req.params.id,
        });
        await newInventory.save();
        console.log("newInventory==>",newInventory);
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});

    }catch(error){
        console.log('Error Found While Add Data',error);
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("Req id=>",req.params.id);
    try{
        let result = await CanteenInventory.find({createdBy : req.params.id, deleted : false});
        console.log("result=>",result);

        let total_recodes = await CanteenInventory.countDocuments({createdBy : req.params.id, deleted : false});
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
}

const view = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("Id=>", req.params.id);

    let result = await CanteenInventory.findById({_id : req.params.id});
    console.log("result=>",result);

    if(!result){
        return res.status(404).json({message : "Product is Found.."});
    }
    res.status(200).json(result);
}

const edit = async (req, res) => {
    console.log("Edittttt In CanteenInventory Controller..");
    console.log("Id=>", req.params.id);

    try{
        let result = await CanteenInventory.updateOne(
            {_id : req.params.id},
            {
                $set : {
                    productName : req.body.productName,
                    mesurment : req.body.mesurment,
                }
            }
        );
        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
        console.log("result==>",result);
    }catch(error){
        console.log("Found Error While Update", error);
        res.status(400).json({message : messages.DATA_UPDATED_FAILED});
    }
}

const deleteData = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("Id=>", req.params.id);

    try{
        let result = await CanteenInventory.findById({_id : req.params.id});

        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
            await CanteenInventory.findByIdAndUpdate({_id : req.params.id},{deleted : true});
            console.log("Product Details deleted successfully !!");
            res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
        }
    }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}

export default { add, index, view, edit, deleteData };