import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';
import portfolioRoutes from './src/routes/portfolioRoutes.js'
import stockRoutes from './src/routes/stockRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stock', stockRoutes);

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
