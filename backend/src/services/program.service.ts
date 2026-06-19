import { Program } from "../models";
import { createAuditLog } from "../utils/audit";
import { sequelize } from "../config/database";
import { Transaction } from "sequelize";

class ProgramService {
  async createProgram(
    creatorId: string,
    title: string,
    description?: string,
    transaction?: Transaction,
  ) {
    const activeTransaction = transaction ?? (await sequelize.transaction());
    const ownsTransaction = !transaction;

    try {
      const program = await Program.create(
        {
          creatorId,
          title,
          description,
        },
        { transaction: activeTransaction },
      );

      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "CREATE",
          entityType: "Program",
          entityId: program.id,
        },
        activeTransaction,
      );

      if (ownsTransaction) {
        await activeTransaction.commit();
      }

      return program;
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }

  async getPrograms(creatorId: string) {
    return Program.findAll({
      where: {
        creatorId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async getProgramById(creatorId: string, programId: string) {
    return Program.findOne({
      where: {
        id: programId,
        creatorId,
      },
    });
  }

  async updateProgram(
    creatorId: string,
    programId: string,
    payload: {
      title?: string;
      description?: string;
    },
    transaction?: Transaction,
  ) {
    const activeTransaction = transaction ?? (await sequelize.transaction());
    const ownsTransaction = !transaction;

    try {
      const program = await Program.findOne({
        where: {
          id: programId,
          creatorId,
        },
        transaction: activeTransaction,
      });

      if (!program) {
        throw new Error("Program not found");
      }

      await program.update(payload, { transaction: activeTransaction });
      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "UPDATE_PROGRAM",
          entityType: "PROGRAM",
          entityId: program.id,
        },
        activeTransaction,
      );

      if (ownsTransaction) {
        await activeTransaction.commit();
      }

      return program;
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }

  async deleteProgram(
    creatorId: string,
    programId: string,
    transaction?: Transaction,
  ) {
    const activeTransaction = transaction ?? (await sequelize.transaction());
    const ownsTransaction = !transaction;

    try {
      const program = await Program.findOne({
        where: {
          id: programId,
          creatorId,
        },
        transaction: activeTransaction,
      });

      if (!program) {
        throw new Error("Program not found");
      }
      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "DELETE_PROGRAM",
          entityType: "PROGRAM",
          entityId: program.id,
        },
        activeTransaction,
      );
      await program.destroy({ transaction: activeTransaction });

      if (ownsTransaction) {
        await activeTransaction.commit();
      }

      return true;
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }
}

export default new ProgramService();
