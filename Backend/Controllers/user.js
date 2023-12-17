import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv';

// Load environment variables from .env file

dotenv.config();


// Create a MySQL connection pool


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// To execute queries
const onCreateUser = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { name, age, gender, email, startDate, feesPaid, batchNumber } = req.body;

    // Validate incoming data...

    const [result] = await connection.query(
      'INSERT INTO users (name, age, gender, email, startDate, feesPaid, batchNumber) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, age, gender, email, startDate, feesPaid, batchNumber]
    );

    connection.release(); // Release the connection after query execution

    return res.status(200).json({ "message": "successful", "data": result, "message_id": "3" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "message": "Error occurred", "error": error });
  }
};




const onGetUserById = async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export { onCreateUser, onGetUserById };
