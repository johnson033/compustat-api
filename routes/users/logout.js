import m from '../../middleware';

export default (router) => {
    router.route("/users/logout").post( 
        m.try(async(req, res) => {
            return m.auth.logout(req, res); 
        })
    )
}