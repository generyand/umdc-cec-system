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

    console.log("Received token:", token);

    if (!token) {
      console.log("No token provided");
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

    console.log("Decoded token:", decoded);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log("Found user:", user);

    if (!user) {
      console.log("No user found for token");
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
    console.error("Token verification error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid authentication token",
    });
  }
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Checking if user is authenticated");
  if (!req.user) {
    console.log("User is not authenticated");
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};
