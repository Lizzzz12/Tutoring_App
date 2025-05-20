import jwt from 'jsonwebtoken';

const tutorMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains teacher's id
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

<<<<<<< HEAD
export default tutorMiddleware;
=======
export default tutorMiddleware;
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
