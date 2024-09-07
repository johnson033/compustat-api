import m from '../../middleware';

export default (router) => {
    router.route("/users/login").post( 
        m.args(["email", "password"]),
        m.try(async(req, res) => {
            return m.auth.login(req, res); 
        })
    )
}