import http from "http"
import express from "express"
import mongoose from "mongoose"
import CORS from "cors"
import * as dotenv from 'dotenv';
import userRouter from "./Routes/uerRoute.js"
import paymentRouter from "./Routes/paymentRoute.js"
import mysql from 'mysql'

const app = express()
dotenv.config(); 

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = process.env.PORT||8000


app.use(CORS())
app.use(express.json())



// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

 





app.use('/welcome', async (req, res) => {
  try {
    res.json({ "welcome_to_flex_app_yoga": "flex" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use("/user",userRouter)
app.use("/payment",paymentRouter)



// Optionally handle process termination or interruption
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});


const server = http.createServer(app);
//start the server
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
