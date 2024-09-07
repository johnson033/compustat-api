import m from '../../middleware';
import models from '../../models';
import bycrypt from 'bcrypt';

export default (router) => {
    router.route("/users/create").post(
        m.args(["name", "email", "password"]), 
        m.try(async(req, res) => {

            // Does the user already exist?  
            const user = await models.User.findOne({
                email: req.body.email
            });
            
            if(user){
                return res.status(400).json({
                    success: false,
                    error: "User already exists."
                }); 
            }

            const hash =  await bycrypt.hash(req.body.password, 10); 
            await models.User.create({
                name: req.body.name,
                email: req.body.email, 
                password: hash, 
                darkMode: false, // False by default, user can change in settings. 
            });

            // Login the user... 
            return m.auth.login(req, res);
        })
    )
}