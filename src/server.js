import express  from 'express';
import {app} from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const Port = process.env.SERVER_PORT || 8080;



app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});


