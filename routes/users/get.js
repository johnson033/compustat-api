import m from '../../middleware';
import models from '../../models';
import toJson from '../../helpers/toJson';

export default (router) => {
    router.route("/users/:userid").get( 
        m.auth.authorize, 
        m.try(async(req, res) => {
            // Get the user id from the request.
            const userId = req.params.userid; 
            let user = await models.User.findById(userId); 
            if(!user)
                return res.status(404).json({
                    success: false,
                    error: "User not found."
                });

            // Remove the user password 
            user = toJson(user);
            user.password = undefined; 

            return res.status(200).json({
                success: true,
                user
            });
        })
    )
}