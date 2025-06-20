import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
const cors = require('cors');
import userRoutes from "../src/routers/userRoute";
import storyRoutes from "../src/routers/storyRoute";
import readLaterRoutes from '../src/routers/RLRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 12;
dotenv.config();

app.use(bodyParser.json());
app.use(cors())
app.use("/users", userRoutes)
app.use("/stories", storyRoutes)
app.use('/ReadLater', readLaterRoutes)


app.get('/stories', (req, res) => {
    res.json({ status: true, data: [] });
});

// app.post('/users', (req, res) => {
//     res.json({ status: true, data: [] });
// });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});