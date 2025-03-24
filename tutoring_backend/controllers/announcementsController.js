import connection from "../models/db.js";

const announcementsController = {};

// Get all announcements with teacher info
announcementsController.getAll = (req, res) => {
    const sql = "SELECT a.id, a.subject, a.price, a.content, a.created_at, t.firstname, t.lastname FROM announcements a JOIN teacher t ON a.teacher_id = t.id ORDER BY a.created_at DESC";
    connection.query(sql, (error, result) => {
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
            message: "Announcements fetched successfully",
            data: result.rows,
        });
    });
};

// Get announcements by teacher
announcementsController.getByTeacher = (req, res) => {
    const teacherId = req.params.teacherId;
    console.log("Received teacherId:", teacherId);

    const teacherIdInt = parseInt(teacherId, 10);

    if (isNaN(teacherIdInt)) {
        return res.status(400).json({
            success: false,
            message: "Invalid teacherId",
        });
    }

    const sql = "SELECT a.id, a.subject, a.price, a.content, a.created_at FROM announcements a WHERE a.teacher_id = $1 ORDER BY a.created_at DESC";
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
            message: "Announcements fetched successfully for the teacher",
            data: result.rows,
        });
    });
};


// Create new announcement
announcementsController.create = async (req, res) => {
    try {
        const { teacherId, subject, price, content } = req.body;

        if (!teacherId || !subject || !price || !content) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const teacherIdInt = parseInt(teacherId, 10);
        if (isNaN(teacherIdInt)) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacherId",
            });
        }

        const sql = "INSERT INTO announcements (teacher_id, subject, price, content) VALUES ($1, $2, $3, $4) RETURNING *";
        connection.query(sql, [teacherIdInt, subject, price, content], (error, result) => {
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
                message: "Announcement created successfully",
                data: result.rows[0],
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

// Update announcement
announcementsController.update = async (req, res) => {
    const announcementId = req.params.id;
    const { subject, price, content } = req.body;

    try {
        const sql = "UPDATE announcements SET subject = $1, price = $2, content = $3 WHERE id = $4 RETURNING *";
        connection.query(sql, [subject, price, content, announcementId], (error, result) => {
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
                    message: "Announcement not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Announcement updated successfully",
                data: result.rows[0],
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

// Delete an announcement
announcementsController.delete = async (req, res) => {
    const announcementId = req.params.id;

    try {
        const sql = "DELETE FROM announcements WHERE id = $1 RETURNING *";
        connection.query(sql, [announcementId], (error, result) => {
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
                    message: "Announcement not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Announcement deleted successfully",
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

export default announcementsController;
