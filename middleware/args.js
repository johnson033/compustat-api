export default (args) => async(req, res, next) => {
    try{
        const obj = {
            ...req.body, 
            ...req.query, 
        }
        const missing = args.filter(a => !(a in obj)); 
        if(missing.length){
            return res.status(400).json({
                success: false,
                error: "Missing input arguments.",
                missing, 
            })
        }
    }catch (err){
        return res.status(500).json({
            error: "Internal Server Error", 
            message: err.message, 
        })
    }

    next(); 
}