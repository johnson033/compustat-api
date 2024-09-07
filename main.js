import dotenv from 'dotenv';
dotenv.config();

// Library imports
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import logRoute from './middleware/log'; 

// API routes
import routes from './routes';

// Database connector
import connect from './db';

// Entry-point
(async () => {
    try {
        await connect();

        // Create Express server as API
        const server = express();
        const router = express.Router();
        // API Configuration
        server.use(bodyParser.json({ limit: '10mb' }))
        server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
        console.log("ORIGIN",process.env.UI_PUBLIC_URL)
        server.use(cors({ credentials: true, origin: process.env.UI_PUBLIC_URL }));
        server.use(cookieParser());
        
        server.use(logRoute); 

        // API Routes
        routes(router, {});

        // Setup API base route
        server.use('/', router);
        server.listen(process.env.SERVER_PORT, "::", async () => {
            console.log("info", `API instance listening on port: ${process.env.SERVER_PORT}`);
        });
    }
    catch (error) {
        console.log("Failed to initialize API. Exiting...");
        console.log(error);
    }
})();