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

contactController.getAll = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM contact");
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    res.status(500).json({ success: false, message: "Failed to fetch contact messages." });
  }
};

// Delete contact message by ID
contactController.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await connection.query("DELETE FROM contact WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    console.error("Error deleting contact message:", err);
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
};

export default contactController;