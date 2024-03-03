const UserModel = require("../models/User");
const mongoose = require('mongoose');


// @desc    get Users
// @route   GET /api/v1/User
// @access  Private(admin)
// can't let user see can it?
//exports.getUsers()

// @desc    get User
// @route   GET /api/v1/Users/id
// @access  Private(user)
// this is just another getMe
    // exports.getUser = async (req,res,next) =>{
    //     try {
    //         const User = await User.findById(req.params.id);
    //         if (!User) {
    //             return res.status(400).send({
    //                 success: false
    //             });
    //         }
    //         res.status(200).send({
    //             success: true,
    //             data: hospital
    //         });
    //     } catch (e) {
    //         res.status(400).send({
    //             success: false
    //         });
    //     }
    // };

    exports.getUser = async (req, res, next) => {
        // Validate the id parameter
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).send({
            success: false,
            message: "Invalid user id",
          });
        }
      
        try {
          // Find the user by id
          const user = await UserModel.findById(req.params.id);
          if (!user) {
            return res.status(404).send({
              success: false,
              message: "User not found",
            });
          }
          // Send the user data
          res.status(200).send({
            success: true,
            data: user,
          });
        } catch (e) {
          // Handle the errors
          res.status(500).send({
            success: false,
            message: e.message,
          });
        }
      };
      

// @desc    create user
// @route   POST /api/v1/User
// @access  Private(admin)
//this one also useless
//maybe for testing account??????   
exports.createUser = async (req,res,next)=>{
    const user = await UserModel.create(req.body);
    res.status(201).json({success:true, data:user});
}


// @desc    update user
// @route   PuT /api/v1/Users
// @access  Private(admin,user)
//exports.updateUser()

// @desc    delete user
// @route   GET /api/v1/Users
// @access  Private(admin,user)
//exports.deleteUser()

