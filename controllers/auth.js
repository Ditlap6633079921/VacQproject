const User = require('../models/User');



//@desc         Logout user
//@route        GET/v1/auth/login
//@access       Private
exports.logout=async(reg,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now() + 10*1000),
        httpOnly:true
    });
    res.status(200).json({success:true,data:{}});
};


//@desc     register user
//@route    POST/api/v1/auth/register
//@access   public
exports.register= async (req,res,next)=>{
    try{
        const{name,email,password,role}=req.body;
        //create user
        const user=await  User.create({
            name,
            email,
            password,
            role
        });
        
        sendTokenResponse(user,200,res);
    }
    catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
};


//@desc         Login user
//@route        POST /api/v1/auth/login
//@access       Public
exports.login= async (req,res,next) =>{
    const {email,password}=req.body;
   
    //valid email and password 
    if(!email || !password){
            return res.status(400).json({success:false, msg:'Please provide email and password'});
    }

   
    //Check for user
    const user = await
    User.findOne({email}).select('+password');

    if(!user){
            return res.status(400).json({success:false,msg:'invalid credential'});
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({success:false,msg:'Invalid credential'});
    }
    
    //Create Token
    //used to be the code above but now change to this function

    sendTokenResponse(user,200,res);

};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res)=>{
    //create token
    const token=user.getSignedJwtToken();
    const options = {
        expires:new  Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    });
}

//@desc      Get current Logged in user
//@route     POST /api/v1/auth/me
//@access    Private
exports.getMe=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
};