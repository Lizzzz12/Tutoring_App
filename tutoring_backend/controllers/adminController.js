import connection from "../models/db.js";

const adminController = {};

// Admin Login (simplified without bcrypt or JWT)
adminController.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  try {
    const result = await connection.query("SELECT * FROM admin WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    const admin = result.rows[0];

    if (password !== admin.password) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Success - no token, just success true
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all pending teacher registration requests from teacher_requests table
adminController.getPendingTeachers = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM teacher_requests WHERE status = 'pending'");
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Failed to fetch pending teachers:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending teachers', error });
  }
};

// Approve teacher request (wrapper calling teacherController.reviewTeacher internally is recommended)
// Here is direct approve function for adminController:
adminController.approveTeacher = async (req, res) => {
  const teacherId = req.params.id;
  try {
    // Fetch the request data from teacher_requests
    const requestResult = await connection.query("SELECT * FROM teacher_requests WHERE id = $1", [teacherId]);
    if (requestResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Teacher request not found" });
    }
    const teacherRequest = requestResult.rows[0];

    // Insert into teacher table
    await connection.query(`
      INSERT INTO teacher (
        firstname, lastname, email, phone, address,
        description, img_url, subject, price, availability,
        tutoring_location, username, password, status
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, 'approved'
      )
    `, [
      teacherRequest.firstname,
      teacherRequest.lastname,
      teacherRequest.email,
      teacherRequest.phone,
      teacherRequest.address,
      teacherRequest.description,
      teacherRequest.img_url,
      teacherRequest.subject,
      teacherRequest.price,
      teacherRequest.availability,
      teacherRequest.tutoring_location,
      teacherRequest.username,
      teacherRequest.password
    ]);

    // Delete from teacher_requests
    await connection.query("DELETE FROM teacher_requests WHERE id = $1", [teacherId]);

    res.status(200).json({ success: true, message: 'Teacher approved and registered successfully' });
  } catch (error) {
    console.error("Failed to approve teacher:", error);
    res.status(500).json({ success: false, message: 'Failed to approve teacher', error });
  }
};

// Reject teacher request
adminController.rejectTeacher = async (req, res) => {
  const teacherId = req.params.id;
  try {
    const result = await connection.query("DELETE FROM teacher_requests WHERE id = $1", [teacherId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Teacher request not found' });
    }
    res.status(200).json({ success: true, message: 'Teacher registration request rejected and removed' });
  } catch (error) {
    console.error("Failed to reject teacher:", error);
    res.status(500).json({ success: false, message: 'Failed to reject teacher', error });
  }
};

export default adminController;
