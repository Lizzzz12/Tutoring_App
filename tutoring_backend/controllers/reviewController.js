import connection from "../models/db.js";

const reviewController = {};

// Create a new review
reviewController.createReview = async (req, res) => {
  try {
    const { studentId, teacherId, title, review, rating } = req.body;

    if (!studentId || !teacherId || !title || !review || !rating) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (studentId, teacherId, title, review, rating) are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const sql =
      "INSERT INTO reviews (student_id, teacher_id, title, review, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    connection.query(
      sql,
      [studentId, teacherId, title, review, rating],
      (error, result) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: error.message,
          });
          console.error(error);
          return;
        }
        res.status(201).json({
          success: true,
          message: "Review created successfully",
          data: result.rows[0],
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    console.error(err);
  }
};

// Get reviews for a specific teacher
reviewController.getReviewsByTeacher = (req, res) => {
  const teacherId = req.params.teacherId;
  const teacherIdInt = parseInt(teacherId, 10);

  if (isNaN(teacherIdInt)) {
    return res.status(400).json({
      success: false,
      message: "Invalid teacherId",
    });
  }

  const sql = `
        SELECT r.id, r.title, r.review, r.rating, 
            s.firstname AS student_firstname, s.lastname AS student_lastname
        FROM reviews r
        JOIN student s ON r.student_id = s.id
        WHERE r.teacher_id = $1
        ORDER BY r.id DESC
    `;
  connection.query(sql, [teacherIdInt], (error, result) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
      console.error(error);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully for the teacher",
      data: result.rows,
    });
  });
};

// Delete a review
reviewController.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const sql = "DELETE FROM reviews WHERE id = $1 RETURNING *";
    connection.query(sql, [reviewId], (error, result) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
        console.error(error);
        return;
      }

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    console.error(err);
  }
};

export default reviewController;
