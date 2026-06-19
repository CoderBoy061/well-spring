import crypto from "crypto";
import { Op } from "sequelize";
import { Creator } from "../models";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { sequelize } from "../config/database";
import { Transaction } from "sequelize";

class AuthService {
  async signup(
    name: string,
    email: string,
    password: string,
    transaction?: Transaction,
  ) {
    const activeTransaction = transaction ?? (await sequelize.transaction());
    const ownsTransaction = !transaction;

    try {
      const existingCreator = await Creator.findOne({
        where: { email },
        transaction: activeTransaction,
      });

      if (existingCreator) {
        throw new Error("Email already exists");
      }

      const hashedPassword = await hashPassword(password);

      const creator = await Creator.create(
        {
          name,
          email,
          password: hashedPassword,
        },
        { transaction: activeTransaction },
      );

      const token = generateToken({
        creatorId: creator.id,
        email: creator.email,
      });

      if (ownsTransaction) {
        await activeTransaction.commit();
      }

      return {
        token,
        creator: {
          id: creator.id,
          name: creator.name,
          email: creator.email,
        },
      };
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }

  async login(email: string, password: string) {
    const creator = await Creator.findOne({
      where: { email },
    });

    if (!creator) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, creator.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      creatorId: creator.id,
      email: creator.email,
    });

    return {
      token,
      creator: {
        id: creator.id,
        name: creator.name,
        email: creator.email,
      },
    };
  }

  async requestPasswordReset(email: string) {
    const creator = await Creator.findOne({
      where: { email },
    });

    if (!creator) {
      return {
        success: true,
        message:
          "If that email is registered, a password reset link was issued.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await creator.update({
      passwordResetToken: resetToken,
      passwordResetExpires: expiresAt,
    });

    return {
      success: true,
      message: "Password reset requested.",
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const creator = await Creator.findOne({
      where: {
        passwordResetToken: resetToken,
        passwordResetExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!creator) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await hashPassword(newPassword);

    await creator.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return {
      success: true,
      message: "Password has been reset successfully.",
    };
  }
}

export default new AuthService();
