/* eslint-disable no-undef */
import dotenv from 'dotenv';
dotenv.config();

export default {
    MONGODB_URI: process.env.MONGODB_URI,
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
    PORT: process.env.PORT || 3001
};


