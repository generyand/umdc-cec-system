import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Authentication token is required",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid authentication token",
      });
      return;
    }

    // Attach user to request object
    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid authentication token",
    });
  }
};
