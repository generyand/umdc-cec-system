import { Handler } from "express";
import { authService } from "../services/auth.service.js";
import { AuthError, ValidationError } from "../utils/errors.js";
// import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { Request, Response, NextFunction } from "express";

// Update controller types
export const register: Handler = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, department, contactNumber } =
      req.body;

    // Check if email exists first
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        errors: [
          {
            message: "Email already registered",
            field: "email",
          },
        ],
      });
      return;
    }

    const { user, accessToken } = await authService.register({
      email,
      password,
      firstName,
      lastName,
      department,
      contactNumber,
    });

    res.status(201).json({
      user,
      token: accessToken,
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const login: Handler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.login({
      email,
      password,
    });

    res.status(200).json({
      user,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Simply return success - token handling will be done on client side
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: Handler = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ValidationError("Invalid reset token");
    }

    if (!user.resetPasswordToken || !user.resetTokenExpiry) {
      throw new ValidationError("Reset token has expired");
    }

    if (user.resetPasswordToken !== token) {
      throw new ValidationError("Invalid reset token");
    }

    if (user.resetTokenExpiry < new Date()) {
      throw new ValidationError("Reset token has expired");
    }

    await authService.updatePassword({
      userId: user.id,
      newPassword,
    });

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
