import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Create a MySQL connection pool
// Load environment variables from .env file
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// post route to store payment information of users in the MySQL database
export default {
  onCreatPayment: async (req, res) => {
    const { mode, card, upiId, email } = req.body;

    if (!email || email === "") {
      res.status(400).json({ message: "Email missing", message_id: "0" });
      return;
    }

    if (mode === "card") {
      const { holderName, expirationDate, cardNo, cvvCode } = card;

      if (!holderName || !expirationDate || !cardNo || !cvvCode ||
        holderName === "" || expirationDate === "" || cardNo === "" || cvvCode === "") {
        res.status(400).json({
          message: "Insufficient Information in card details",
          message_id: "0",
        });
        return;
      }

      try {
        const [rows] = await pool.query('SELECT * FROM paymentcollection WHERE email = ?', [email]);

        if (rows.length > 0) {
          const updateResult = await pool.query(
            'UPDATE paymentcollection SET holderName=?, expirationDate=?, cardNo=?, cvvCode=? WHERE email=?',
            [holderName, expirationDate, cardNo, cvvCode, email]
          );
          res.status(200).json({
            message: "Payment method updated successfully",
            data: updateResult[0],
            message_id: "1",
          });
        } else {
          const insertResult = await pool.query(
            'INSERT INTO paymentcollection (holderName, expirationDate, cardNo, cvvCode, email) VALUES (?, ?, ?, ?, ?)',
            [holderName, expirationDate, cardNo, cvvCode, email]
          );
          res.status(201).json({
            message: "Payment method inserted successfully",
            data: insertResult[0],
            message_id: "3",
          });
        }
      } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ message: "Internal server error", error: error });
      }
    } else if (mode === "upi") {
      try {
        const [rows] = await pool.query('SELECT * FROM paymentcollection WHERE email = ?', [email]);

        if (rows.length > 0) {
          const updateResult = await pool.query(
            'UPDATE paymentcollection SET upiId=? WHERE email=?',
            [upiId, email]
          );
          res.status(200).json({
            message: "Payment method updated successfully",
            data: updateResult[0],
            message_id: "1",
          });
        } else {
          const insertResult = await pool.query(
            'INSERT INTO paymentcollection (upiId, email) VALUES (?, ?)',
            [upiId, email]
          );
          res.status(201).json({
            message: "Payment method inserted successfully",
            data: insertResult[0],
            message_id: "3",
          });
        }
      } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ message: "Internal server error", error: error });
      }

    }
  }
};
