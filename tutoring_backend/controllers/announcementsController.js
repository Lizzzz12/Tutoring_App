import connection from "../models/db.js";

const announcementsController = {};

// Get all announcements with teacher info
announcementsController.getAll = (req, res) => {
    const sql = `
        SELECT a.id, a.subject, a.price, a.content, a.created_at, t.firstname, t.lastname 
        FROM announcements a 
        JOIN teacher t ON a.teacher_id = t.id 
        ORDER BY a.created_at DESC
    `;
    connection.query(sql, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            message: "Announcements fetched successfully",
            data: result.rows,
        });
    });
};

// Get announcements by teacher ID
announcementsController.getByTeacher = (req, res) => {
    const teacherId = parseInt(req.params.teacherId, 10);

    if (isNaN(teacherId)) {
        return res.status(400).json({ success: false, message: "Invalid teacherId" });
    }

    // const sql = `
    //     SELECT a.id, a.teacher_id, a.subject, a.price, a.content, a.created_at 
    //     FROM announcements a 
    //     WHERE a.teacher_id = $1 
    //     ORDER BY a.created_at DESC
    // `;
    const sql = `SELECT * FROM announcements WHERE teacher_id = $1`;
    connection.query(sql, [teacherId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            message: "Announcements fetched successfully for the teacher",
            data: result.rows,
        });
    });
};

// Get announcement by ID
announcementsController.getById = (req, res) => {
    const announcementId = parseInt(req.params.id, 10);

    if (isNaN(announcementId)) {
        return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    }

    const sql = `
        SELECT a.id, a.teacher_id, a.subject, a.price, a.content, a.created_at, t.firstname, t.lastname 
        FROM announcements a 
        JOIN teacher t ON a.teacher_id = t.id 
        WHERE a.id = $1
    `;

    connection.query(sql, [announcementId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        res.status(200).json({
            success: true,
            message: "Announcement fetched successfully",
            data: result.rows[0],
        });
    });
};



// Create new announcement (authenticated)
announcementsController.create = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { subject, price, content } = req.body;

        if (!subject || !price || !content) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const sql = `
            INSERT INTO announcements (teacher_id, subject, price, content) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        connection.query(sql, [teacherId, subject, price, content], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: error.message });
            }

            res.status(201).json({
                success: true,
                message: "Announcement created successfully",
                data: result.rows[0],
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update announcement (authenticated & ownership check)
announcementsController.update = async (req, res) => {
    const announcementId = req.params.id;
    const { subject, price, content } = req.body;
    const teacherId = req.user.id;

    const checkSql = "SELECT * FROM announcements WHERE id = $1";
    connection.query(checkSql, [announcementId], (err, result) => {
        if (err || result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        const announcement = result.rows[0];
        if (announcement.teacher_id !== teacherId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const updateSql = `
            UPDATE announcements 
            SET subject = $1, price = $2, content = $3 
            WHERE id = $4 RETURNING *
        `;
        connection.query(updateSql, [subject, price, content, announcementId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: err.message });
            }

            res.status(200).json({
                success: true,
                message: "Announcement updated successfully",
                data: result.rows[0],
            });
        });
    });
};

// Delete announcement (authenticated & ownership check)
announcementsController.delete = async (req, res) => {
    const announcementId = req.params.id;
    const teacherId = req.user.id;

    const checkSql = "SELECT * FROM announcements WHERE id = $1";
    connection.query(checkSql, [announcementId], (err, result) => {
        if (err || result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        const announcement = result.rows[0];
        if (announcement.teacher_id !== teacherId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const deleteSql = "DELETE FROM announcements WHERE id = $1 RETURNING *";
        connection.query(deleteSql, [announcementId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: err.message });
            }

            res.status(200).json({ success: true, message: "Announcement deleted successfully" });
        });
    });
};

export default announcementsController;