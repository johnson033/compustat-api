import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const RECONNECT_AFTER_MS = 1000;

// Number of attempts
let attempts = 0;

// Database connection function
const _connect = async () => {
    try {
        await mongoose.connect(
            process.env.DB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log('Database connection established.');
    }
    
    catch (error) {
        console.log('Database connection failed. Attempting to reconnect... (' + String(attempts) + ')');
        setTimeout(_connect, RECONNECT_AFTER_MS);
    }
}

mongoose.connection.once('disconnected', async () => {
    console.log('Database connection lost. Attempting to reconnect...');
    attempts = 0;

    await _connect();
});

const connect = async () => {
    return new Promise(r => {
        mongoose.connection.once('open', r);
        _connect();
    });
}

export default connect;