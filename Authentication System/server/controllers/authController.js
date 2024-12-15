import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { now } from 'mongoose';


export const register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.json({success: false, message:"Missing details"})
    }

    try {
        
        const existingUser = await userModel.findOne({email})

        if (existingUser) {
            return res.json({success:false, message:"User already exists"})
        }
        
        const hashedPw = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password: hashedPw});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // sending wellcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email, 
            subject: 'Wellcome to Listyo',
            text: `Wellcome to Listyo website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true});

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const login = async (req, res) => {
    
    const {email, password} = req.body

    if (!email || !password) {
        return res.json({success:false, message:"Email and password are required"})
    }
    
    try {
        
        const user = await userModel.findOne({email});
        const isMatch = await bcrypt.compare(password, user.password)
        
        if (!user) {
            return res.json({success:false, message:"Invalid Email"})
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        
        if (!isMatch) {
            return res.json({success:false, message:"Invalid Password"})
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true});
        
    } catch (error) {
        return res.json({success:false, message: error.message})
    }

}

export const logout = async (req, res) => {

    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
        })

        return res.json({success:true, message:"Logged Out"})
        
    } catch (error) {
    }
    
}

export const sendVerifyOtp = async (req, res) => {
    
    try {

        // send verification OTP to the User's email
        const {userId} = req.body

        const user = await userModel.findById(userId);
        
        if (user.isAccountVerified) {
            return res.json({success:false, message:"account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const  mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email, 
            subject: 'Account verfication OTP',
            text: `Your OTP is ${otp}. verify your account using this OTP.`
        }

        await transporter.sendMail(mailOption);

        res.json({success:true, message:"Verification OTP Sent on Email"});
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }

}

export const verifyEmail = async (req, res) => {

     // send verification OTP to the User's email
     const {userId, otp} = req.body

     if (!userId || !otp) {
        return res.json({success:false, message:"Missing Details"})
     }
     
     try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({success:false, message:"User not found"});
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success:false, message:"Invalid OTP"});
        }
        
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.json({success:false, message:"OTP Expired"});
        }
        
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        
        await user.save();
        
        return res.json({success:true, message:"Email verified successfully"});
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// check if user is authenticared
export const isAuthenticated = async (req, res) => {
    try {   
        
        return res.json({success:true});


    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// send password reset otp
export const sendResetOtp = async (req, res) => {
    
    const {email} = req.body;
    
    if (!email) {
        res.json({success:false, message: "Email is required"})
    }
    
    try {
        
        const user = await userModel.findOne({email});
        
        if (!user) {
            
            res.json({success:false, message: "User not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 60 * 1000

        await user.save();

        const  mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email, 
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
        }

        await transporter.sendMail(mailOption);

        return res.json({success:true, message:"OTP sent to your email"})

    } catch (error) {
        res.json({success:false, message: error.message})
    }

}

// Reset user pw
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if (!email || !otp || !newPassword) {
        res.json({success:false, message: "Email, OTP, new password are required"})
    }

    try {

        const user = await userModel.findOne({email});

        if (!user) {
            res.json({success:false, message: "User not found"})
        }
        
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            res.json({success:false, message: "Invalid OTP"})
        }
        
        if (user.resetOtpExpiredAt < Date.now()) {
            res.json({success:false, message: "OTP expires"})
        }

        const hashedPw = await bcrypt.hash(newPassword, 10);

        user.password = hashedPw;
        user.resetOtp = " ";
        user.resetOtpExpiredAt = 0;

        await user.save();

        return res.json({success:true, message:"Password has been reset successfully"})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}