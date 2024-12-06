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

    try {
      // Try to verify the token
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

      req.user = {
        id: user.id,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Token has expired, try to refresh it
        try {
          const newToken = await refreshToken(token);

          // Send the new token in the response header
          res.setHeader("X-New-Token", newToken);

          // Decode the new token and continue with the request
          const decoded = jwt.verify(newToken, process.env.JWT_SECRET!) as {
            userId: string;
          };

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

          req.user = {
            id: user.id,
          };

          next();
        } catch (refreshError) {
          res.status(401).json({
            status: "error",
            message: "Token expired. Please log in again.",
          });
        }
      } else {
        res.status(401).json({
          status: "error",
          message: "Invalid authentication token",
        });
      }
    }
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

// Add refresh token logic
const refreshToken = async (oldToken: string) => {
  try {
    const decoded = jwt.decode(oldToken);
    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token");
    }

    // Create new token
    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" } // Adjust expiration time as needed
    );

    return newToken;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};
