import Mongoose from 'mongoose';

export default Mongoose.model('Login', new Mongoose.Schema({
    user: Mongoose.Types.ObjectId, 
    active: Boolean, 
    token: String, 
    expires: Date,
    ip: String, 
    userAgent: String, 
    created: { type: Date, default: () => Date.now()}, 
}))