import Mongoose from 'mongoose';

export default Mongoose.model('User', new Mongoose.Schema({
    name: String, 
    email: String, 
    password: String, 
    darkMode: Boolean, 
    notifications: [
        {
            title: String,
            body: String, 
            timestamp: { type: Date, default: () => Date.now()}
        }
    ],
    tokenMFA: String, 
    tokenReset: String, 
    created: { type: Date, default: () => Date.now()},
    lastLogin: { type: Date, default: () => Date.now()}, 
    lastSync: { type: Date, default: () => Date.now()}, 
    deleted: { type: Boolean, default: () => false}
}))