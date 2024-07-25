require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

// Middleware
app.use(cors());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Chanakya DataBase Connected!");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};
connectDB();

// Routes
app.get('/api/random', (req, res) => {
  res.send('Hello from Chanakya Niti Backend!');
});

// Start Server
app.listen(port, () => {
  console.log(`Chanakya Backend listening on port http://localhost:${port}`);
});
