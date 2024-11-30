import { Handler } from "express";
import { authService } from "../services/auth.service.js";
import { AuthError, ValidationError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
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

    const { user, accessToken, refreshToken } = await authService.register({
      email,
      password,
      firstName,
      lastName,
      department,
      contactNumber,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user,
      token: accessToken,
    });

    console.log(user);

    console.log("User logged in successfully");
    return;
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
    // Even if the user is not authenticated, we should still clear their cookies
    console.log("Clearing cookies");
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // If we have a user ID, clear their refresh token in the database
    if (req.user?.id) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
      });
    }

    res.status(200).json({ message: "Logged out successfully" });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const refreshToken: Handler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new AuthError("Invalid refresh token");
    }

    const newAccessToken = authService.generateAccessToken(user.id);
    const newRefreshToken = authService.generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken: newAccessToken,
    });
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
