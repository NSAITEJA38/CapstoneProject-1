import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

// AUTHORIZATION of a user by cookie and role
export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized request. Please login",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden. Permission role mismatch",
        });
      }

      req.user = decodedToken;

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      next(err);
    }
  };
};