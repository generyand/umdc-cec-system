import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { AuthError } from "../utils/errors.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface LoginInput {
  email: string;
  password: string;
}

interface UpdatePasswordInput {
  userId: string;
  newPassword: string;
}

interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  contactNumber?: string;
}

export const authService = {
  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "24h" });
  },

  async register({
    email,
    password,
    firstName,
    lastName,
    departmentId,
    contactNumber,
  }: RegisterParams) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        departmentId,
        contactNumber,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        departmentId: true,
        contactNumber: true,
        createdAt: true,
      },
    });

    const accessToken = this.generateAccessToken(user.id);

    return { user, accessToken };
  },

  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      throw new AuthError("Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        departmentId: user.departmentId,
        contactNumber: user.contactNumber,
        role: user.role,
      },
      accessToken,
    };
  },

  async updatePassword({ userId, newPassword }: UpdatePasswordInput) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        hashedPassword,
        resetPasswordToken: null,
        resetTokenExpiry: null,
      },
    });
  },
};
