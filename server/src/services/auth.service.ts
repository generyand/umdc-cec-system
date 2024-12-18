import { PrismaClient, UserPosition, UserRole } from "@prisma/client";
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
  departmentId: number | null;
  bannerProgramId: number | null;
  role: UserRole;
  position?: UserPosition;
  contactNumber?: string;
}

export const authService = {
  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!);
  },

  async register({
    email,
    password,
    firstName,
    lastName,
    departmentId,
    bannerProgramId,
    role,
    position,
    contactNumber,
  }: RegisterParams) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const normalizedDepartmentId = departmentId === 0 ? null : departmentId;
    const normalizedBannerProgramId = bannerProgramId === 0 ? null : bannerProgramId;

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        departmentId: normalizedDepartmentId,
        bannerProgramId: normalizedBannerProgramId,
        contactNumber,
        role,
        position,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        departmentId: true,
        bannerProgramId: true,
        bannerProgram: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          }
        },
        contactNumber: true,
        role: true,
        position: true,
        createdAt: true,
      },
    });

    const accessToken = this.generateAccessToken(user.id);
    console.log("User successfully registered", user);
    return { user, accessToken };
  },

  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
      },
    });

    if (!user) {
      throw new AuthError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword) {
      throw new AuthError("Invalid credentials");
    }

    const currentSchoolYear = await prisma.schoolYear.findFirst({
      where: { isCurrent: true },
    });

    console.log("Current school year", currentSchoolYear);

    if (!currentSchoolYear) {
      throw new Error("No active school year found");
    }

    const accessToken = this.generateAccessToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        departmentId: user.departmentId,
        department: user.department,
        contactNumber: user.contactNumber,
        role: user.role,
        position: user.position,
      },
      currentSchoolYear,
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
