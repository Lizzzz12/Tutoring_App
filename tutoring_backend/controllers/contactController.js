// controllers/contactController.js
import connection from "../models/db.js";

const contactController = {};

// Create contact message
contactController.create = (req, res) => {
  const { fullname, email, subject, message } = req.body;

  if (!fullname || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const sql = `
    INSERT INTO contact (fullname, email, subject, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  connection.query(sql, [fullname, email, subject, message], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: result.rows[0],
    });
  });
};

export default contactController;
