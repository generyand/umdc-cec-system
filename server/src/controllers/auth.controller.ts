import { Handler } from "express";
import { authService } from "../services/auth.service.js";
import { AuthError, ValidationError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

// Define types for request bodies
// interface RegisterRequest {
//   email: string;
//   password: string;
//   name: string;
// }

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface ResetPasswordRequest {
//   email: string;
//   token: string;
//   newPassword: string;
// }

// Update controller types
export const register: Handler = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const { user, accessToken, refreshToken } = await authService.register({
      email,
      password,
      name,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user,
      accessToken,
    });

    console.log("User registered successfully");
  } catch (error) {
    next(error);
  }

  // console.log("register controller");
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
      accessToken,
    });

    console.log("User logged in successfully");
  } catch (error) {
    next(error);
  }
};

export const logout: Handler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
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
