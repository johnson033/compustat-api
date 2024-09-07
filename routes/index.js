import users from './users';

const upTime = new Date();

export default (router, params) => {
    router.route('/').get(async (req, res) => {
        return res.json({
            success: true,
            message: "",
            status: "Up",
            since: upTime.toLocaleString()
        });
    });

    users(router, params); 
}