import connection from "../models/db.js";

const announcementReviewController = {};

// Fetch reviews for a specific announcement
announcementReviewController.getReviewsByAnnouncement = async (req, res) => {
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
            SELECT r.id, s.firstname AS student_name, r.rating, r.review, r.created_at
            FROM "announcementreviews" r
            JOIN "student" s ON r.student_id = s.id
            WHERE r.announcement_id = $1
            ORDER BY r.created_at DESC
        `;
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
};

// Create a review for an announcement
announcementReviewController.createReview = async (req, res) => {
    const { student_id, announcement_id, rating, review } = req.body;

    if (!student_id || !announcement_id || !rating || !review) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const query = `
            INSERT INTO "announcementreviews" (student_id, announcement_id, rating, review)
            VALUES ($1, $2, $3, $4)
            RETURNING id, student_id, announcement_id, rating, review, created_at
        `;
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
};

export default announcementReviewController;