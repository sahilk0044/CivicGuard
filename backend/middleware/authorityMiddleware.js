import jwt from "jsonwebtoken";
import Authority from "../models/Authority.js";

const authorityMiddleware = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure this is authority token
    if (decoded.role !== "authority") {
      return res.status(403).json({
        message: "Access denied: Not an authority"
      });
    }

    const authority = await Authority.findById(decoded.id);

    if (!authority) {
      return res.status(404).json({
        message: "Authority not found"
      });
    }

    req.user = authority; // ✅ attach authority
    next();

  } catch (error) {

    console.log("Authority Auth Error:", error);

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};

export default authorityMiddleware;