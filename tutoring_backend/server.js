import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', routes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
