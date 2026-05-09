import express from 'express';
import dotenv from "dotenv";
import connectdb from './database/db.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1/user', userRoute);

app.get('/', (req, res) => {
  res.send("CartVerse");
});

// ✅ Start server only after DB connects
const startServer = async () => {
  try {
    await connectdb();
    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Server failed to start:", error.message);
  }
};

startServer();