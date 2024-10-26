
import express from 'express';
import summaryRoutes from './src/routes/summaryRoutes.js';
import { connectDB } from './src/database/connection.js';
import logger from './src/utils/logger.js';
import config from './src/config/config.js';
import cors from 'cors'


const app = express();
app.use(express.json());

app.use(cors());


// Routes
app.use('/api', summaryRoutes);

// Connect to MongoDB
connectDB();

const PORT = config.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

