import connection from "../models/db.js";

const announcementReviewController = {};

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
};

export default announcementReviewController;
