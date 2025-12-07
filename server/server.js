import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from "./routes/showRoute.js";


const app = express();
const PORT = 3000;

// Connection to database

await connectDB();


// Middleware

app.use(express.json());
app.use(cors())
app.use(clerkMiddleware());

// API routes

app.get('/',(req, res)=>{

    res.send("Server is running")
})

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/show',showRouter)

app.listen(PORT,()=>{
    console.log(`Server is listening at http://localhost:${PORT}`);
})
