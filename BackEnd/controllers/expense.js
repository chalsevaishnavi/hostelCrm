import Expenditure from "../model/Expenditures.js";
import Hostel from "../model/Hostel.js";
import User from "../model/User.js";
import messages from "../constants/message.js";

const add = async (req, res) => {
    console.log("In Expenditures Controller..");
    console.log("Id =>",req.params.id);
    console.log("Body Data=>",req.body);
    try{
        const { expenseTitle, price, date } = req.body;

        const data = await User.findById({_id : req.params.id});
        console.log("data==>",data,"==>",data.hostelId);

        // Extract the month name from the date
        // const dateObj = new Date(date);
        // const monthName = dateObj.toLocaleString('default', { month: 'long' });
        // console.log("monthName==>",monthName);

        // Parse the month from the dd-mm-yyyy format date string
        const [day, month, year] = date.split('-');

        // Map month number to month name
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[parseInt(month, 10) - 1];

        console.log("monthName==>", monthName);

        const newExpense = new Expenditure({
            hostelId : data.hostelId,
            expenseTitle,
            price,
            date,
            monthName,
            createdBy : req.params.id,
        });
        await newExpense.save();

        console.log("newExpense =>",newExpense);
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});

    }catch(error){
        console.log('Error Found While Add Data',error);
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req, res) => {
    console.log("In Expenditures Controller..");
    console.log("Id=>",req.params.id);
    try{
        let result = await Expenditure.find({createdBy : req.params.id, deleted : false});
        console.log("result=>",result);

        let total_recodes = await Expenditure.countDocuments({createdBy : req.params.id, deleted : false});
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }  
}

const monthlyExpenses = async (req, res) => {
    try {
        console.log("In monthlyExpenses... Id,", req.params.id);

        // Fetch all expenditures created by the specified user
        const adminData = await Expenditure.find({ createdBy: req.params.id });
        console.log("adminData =>", adminData);

        // Initialize an object to store total expenses for each month
        let monthlyExpenses = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0
        };

        // Iterate through each expenditure document
        for (let expenditure of adminData) {
            const month = expenditure.monthName;
            const amount = expenditure.price; 
            console.log("month==>", month, "amount==>", amount);

            // Add the amount to the corresponding month's total
            if (monthlyExpenses.hasOwnProperty(month)) {
                monthlyExpenses[month] += amount;
            }
        }
        console.log("monthlyExpenses====>", monthlyExpenses);

        // Respond with the aggregated monthly expenses object
        res.status(200).json({ monthlyExpenses });
    } catch (error) {
        console.log("Error =>", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export default { add, index,monthlyExpenses};

