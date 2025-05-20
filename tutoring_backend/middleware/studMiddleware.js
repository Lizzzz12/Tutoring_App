<<<<<<< HEAD
import jwt from "jsonwebtoken";

export default function studMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
=======
import jwt from 'jsonwebtoken';

export default function studMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
    req.studentId = decoded.studentId; // Attach studentId to request object
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
=======
    req.studentId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
>>>>>>> 90a977300ba21d7d60c90fafb5f522d6cc818756
  }
}
