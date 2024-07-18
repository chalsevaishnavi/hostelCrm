import mongoose from 'mongoose';
import User from './User.js';

const ExpenseSchema = new mongoose.Schema({
    hostelId     : { type : String, require : true },
    expenseTitle : { type : String, require : true }, 
    price        : { type : Number, require : true }, 
    date         : { type : Date,   require : true },
    monthName    : {type : String,  require : true},
    deleted      : { type : Boolean, default : false},   
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: User,
    }
});

// Expenditure.calculateMonthlyExpenses = async function() {

//     try{
//         const monthlyExpenses = await this.aggregate([
//             {
//                 $group : {
//                     _id : '$monthName',
//                     totalExpenses : {$sum : '$price'}
//                 }
//             }
//         ]);
//         return monthlyExpenses;

//     }catch(error){
//         console.error('Error calculating monthly expenses:', err);
//         throw err;
//     }
// }

export default mongoose.model('Expenditure',ExpenseSchema);

