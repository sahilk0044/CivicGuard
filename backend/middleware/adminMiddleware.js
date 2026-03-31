import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    console.log("Auth Header:", authHeader); // 🔍 DEBUG

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token); // 🔍 DEBUG

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded); // 🔍 DEBUG

    // ✅ CHECK ROLE
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Not an admin"
      });
    }

    // ✅ IMPORTANT
    req.user = {
      id: decoded.id
    };

    next();

  } catch (error) {

    console.log("Admin Auth Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
};

export default adminMiddleware;