import mongoose from 'mongoose';
import config from '../config/config.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
};