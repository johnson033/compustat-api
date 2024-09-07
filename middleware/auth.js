import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import models from '../models';
import Mongoose from 'mongoose';

// Auth cookie configuration
const authCookieConfig = {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const createLogin = async (req, res, user) => {
    // Create a token. 
    const token = Math.random(64).toString().substring(3) + Math.random(64).toString().substring(3); 
    user.password = undefined; 
    user.__v = undefined; 

    const now = new Date(); 
    const config = {...authCookieConfig}; 
    // Update any login's for this user and make sure they are not active. 
    await models.Login.updateMany({user: user._id}, {'$set': {active: false}}); 
    // Create a new login for this user. 
    await models.Login.create({
        user: user._id, 
        active: true, 
        token: token, 
        expires: now.getTime() + config.maxAge,
        ip: req.headers.ip, 
        userAgent: req.headers.userAgent, 
    }); 

    return res
        .status(200)
        .cookie('userId', user._id, config)
        .cookie('authToken', token, config)
        .json({success: true, user, token});
}

export default {
    login: async (req, res, next,) => {
        // Parse the body and get the email/password;  
        const email = req.body.email;
        const password = req.body.password;
        if(!email || !password)
            return res.status(400).json({
                success: false, 
                authError: true, 
                error: "Email and password are required!"
            }); 

        // Next query the user via email.  
        const user = await models.User.findOne({email: email}); 
        if(!user)
            return res.status(401).json({
                success: false, 
                authError: true, 
                error: "Email or password is incorrect!"
            }); 

        // Comparse the passwords. 
        const matches = bcrypt.compare(password, user.password);  
        if(!matches)
            return res.status(401).json({
                success: false, 
                authError: true, 
                error: "Email or password is incorrect!"
            }); 

        // Password/email match. Set the cookies, login is success! 
        return await createLogin(req, res, user); 
    },
    logout: async (req, res, next) => {
        const userId = req.cookies.userId; 
        const token = req.cookies.authToken;     
        
        if(!userId || !token)
            return res.json({success: false, error: "Invalid user data!"}); 

        // Find the login and update it to inactive.
        await models.Login.updateOne({user: userId, token: token}, {'$set': {active: false}}); 

        return res.status(200)
            .clearCookie('userId')
            .clearCookie('authToken')
            .json({success: true});
    },
    authorize: async (req, res, next) => {
        // Is user logged in? Does the token match?
        if (!req.cookies.userId || !req.cookies.authToken || req.cookies.authToken === "")
            return res.json({
                success: false,
                authError: true, // Authentication error flag
                error: 'Invalid user data!'
            });
        
        // Add user data to request
        req.user = await models.User.findById(req.cookies.userId);
        req.auth = "Normal";

        if (!req.user)
            return res.json({
                success: false,
                authError: true, // Authentication error flag
                error: "You are not logged in. Please go to the login page and try again."
            });
        
        // Fetch the login with this token... 
        const login = await models.Login.findOne({token: req.cookies.authToken, active: true}); 
        if(!login)
            return res.json({
                success: false,
                authError: true, // Authentication error flag
                error: "User is not authorized!"
            });
        
        req.user.password = undefined; 
        req.user.__v = undefined; 
        next(); 
    },
};