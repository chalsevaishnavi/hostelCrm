import User from "../model/User.js";
import Hostel from "../model/Hostel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import messages from '../constants/message.js'

import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const add = async (req, res) => {
console.log("In administrator controller =>");
console.log("Data =>", req.body);
console.log("Img Name =>", req.file);
  try {
    const {
      hostelId,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      aadharCard,
      state,
      city,
      address,
    } = req.body;

    const fileName = req.file ? req.file.filename : null;
    console.log("File Name =>", fileName);

    const existingUser = await User.findOne({email});
    if(existingUser){
        console.log("Email Address Already Exist!!");
        res.status(401).json({ message : messages.EMAIL_ALREADY_EXISTS });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword=>",hashedPassword);

    const data = await Hostel.findOne({uniqueCode : hostelId});
    console.log("data==>",data);
    

    const newUser = new User({
      hostelId,
      hostelname : data.hostelName,
      firstname : firstName,
      lastname : lastName,
      email,
      password : hashedPassword,
      dateOfBirth,
      gender,
      phonenumber : phoneNumber,
      aadharcardId : aadharCard,
      state,
      city,
      address,
      photo: fileName,
      role: "SubAdmin",
    });

    console.log("newUser==>",newUser);
    await newUser.save();

    await Hostel.updateOne({uniqueCode : hostelId},{isAdmin : true});

    res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});
  } catch (error) {
    console.log("Error Found =>", error);
    res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
  }
}

const index = async (req, res) => {
  try{
    let result = await User.find({deleted : false,role:'SubAdmin'});
    console.log("Result =>",result);
    let total_recodes = await User.countDocuments({deleted : false,role:'SubAdmin'});
    console.log("total_recodes==>",total_recodes);
    res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

  }catch(error){
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
}

const view = async (req, res) => {
  console.log("In View");
  console.log("id =>", req.params.id);

  try{
    let user = await User.findById({_id : req.params.id});
    console.log("User=>",user);
    if(!user){
      return res.status(404).json({message : messages.DATA_NOT_FOUND});
    }
    res.status(200).json({user, message : messages.DATA_FOUND_SUCCESS});

  }catch(error){
    console.error("Error:", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
}

const edit = async (req, res) => {
  console.log("In Edit");
  console.log("Id =>",req.params.id);

  // const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // console.log("hashedPassword=>",hashedPassword);

  try{
    let result = await User.updateOne(
      {_id : req.params.id},
      {
        $set : {
          // hostelId : req.body.hostelId,
          firstname: req.body.firstName,
          lastname: req.body.lastName,
          // email: req.body.email,
          // password: req.body.password,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          phonenumber: req.body.phoneNumber,
          aadharcardId: req.body.aadharCard,
          state: req.body.state,
          city: req.body.city,
          address: req.body.address,
          photo: req.file.filename,
        }
      }
    );

    console.log("edit data =>",result);

    res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
  }catch(error){
    console.log("Found Error While Update User", error);
    res.status(400).json({message : messages.DATA_UPDATED_FAILED});
  }
}

const deleteData = async (req,res) => {
  try{
    console.log("in dataData");
    console.log("Id:", req.params.id);

    const user = await User.findById({_id : req.params.id});
    if(!user){
      return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
    }else{

      if(user.role !== 'SubAdmin'){
        await User.findByIdAndUpdate({_id : req.params.id},{deleted : true});
        res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
      }else{
        console.log("Admin can not delete!!");
        res.json({message : "Admin can not delete!!"});
      }

    }
  }catch(error){
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
}

const login = async (req,res) => {
  console.log("In Admin Login Controller");
  console.log("Req Data =>",req.body);
  try{
    const { email, password } = req.body;

    const user = await User.findOne({email});
    console.log("user=>",user);

    if(!user){
      res.status(401).json({message : `Invalid Email , User is not Found of ${email} Email Address`});
      return;
    }

    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch){
      res.status(401).json({message : 'Invalid Password'});
      return;
    }

    const generateToken = (user)=>{
      const payload = {
          userid : user._id,
          email : user.email,
          role : user.admin
      }
  
      const token = jwt.sign(payload,SECRET_KEY,{ expiresIn: '1d' });
      return token;
    }

    //Create JWT Token
    const token = generateToken(user);
    
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({token : token, user, message : "Login Successfully !!"});
  }catch(error){
    console.log("Error Found While Login =>",error);
    res.status(500).json({ message: 'An Error occurred While Login' });
  }
}

export default { add, index, view, edit, deleteData, login };


