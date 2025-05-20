import connection from "../models/db.js";

const announcementReviewController = {};

// Fetch reviews for a specific announcement
announcementReviewController.getReviewsByAnnouncement = async (req, res) => {
<<<<<<< HEAD
  const announcementId = req.params.id;
  const announcementIdInt = parseInt(announcementId, 10);

  if (isNaN(announcementIdInt)) {
    return res.status(400).json({
      success: false,
      message: "Invalid announcementId",
    });
  }

  try {
    const query = `
=======
    const announcementId = req.params.id;
    const announcementIdInt = parseInt(announcementId, 10);

    if (isNaN(announcementIdInt)) {
        return res.status(400).json({
            success: false,
            message: "Invalid announcementId",
        });
    }

    try {
        const query = `
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
            SELECT r.id, s.firstname AS student_name, r.rating, r.review, r.created_at
            FROM "announcementreviews" r
            JOIN "student" s ON r.student_id = s.id
            WHERE r.announcement_id = $1
            ORDER BY r.created_at DESC
        `;
<<<<<<< HEAD
    const result = await connection.query(query, [announcementIdInt]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this announcement",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully for the announcement",
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
=======
        const result = await connection.query(query, [announcementIdInt]);

        if (!result || result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No reviews found for this announcement",
            });
        }

        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully for the announcement",
            data: result.rows,
        });
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
};

// Create a review for an announcement
announcementReviewController.createReview = async (req, res) => {
<<<<<<< HEAD
  const { student_id, announcement_id, rating, review } = req.body;

  if (!student_id || !announcement_id || !rating || !review) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const query = `
=======
    const { student_id, announcement_id, rating, review } = req.body;

    if (!student_id || !announcement_id || !rating || !review) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const query = `
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
            INSERT INTO "announcementreviews" (student_id, announcement_id, rating, review)
            VALUES ($1, $2, $3, $4)
            RETURNING id, student_id, announcement_id, rating, review, created_at
        `;
<<<<<<< HEAD
    const result = await connection.query(query, [
      student_id,
      announcement_id,
      rating,
      review,
    ]);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
=======
        const result = await connection.query(query, [student_id, announcement_id, rating, review]);

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Failed to create review:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
};

export default announcementReviewController;
