export default (func) => async(req, res) => {
    try {
        await func(req, res); 
    }catch(err){
        res.status(500).json({
            error: "Internal Server Error", 
            message: err.message, 
        })
    }
}