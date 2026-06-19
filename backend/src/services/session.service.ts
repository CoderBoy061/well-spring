import { Session, Program } from "../models";
import { createAuditLog } from "../utils/audit";
import { sequelize } from "../config/database";
import { Transaction } from "sequelize";

class SessionService {
  async createSession(
    creatorId: string,
    programId: string,
    payload: {
      title: string;
      duration: number;
      instructorName: string;
      mediaUrl?: string;
      tags?: string[];
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
        lock: activeTransaction.LOCK.UPDATE,
      });

      if (!program) {
        throw new Error("Program not found");
      }

      const maxPosition = await Session.max("position", {
        where: {
          programId,
          creatorId,
        },
        transaction: activeTransaction,
      });

      const nextPosition =
        typeof maxPosition === "number" ? maxPosition + 1 : 1;

      const session = await Session.create(
        {
          ...payload,
          tags: payload.tags || [],
          creatorId,
          programId,
          position: nextPosition,
        },
        { transaction: activeTransaction },
      );

      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "CREATE_SESSION",
          entityType: "SESSION",
          entityId: session.id,
        },
        activeTransaction,
      );

      if (ownsTransaction) {
        await activeTransaction.commit();
      }

      return session;
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }

  async getSessions(creatorId: string, programId: string) {
    return Session.findAll({
      where: {
        creatorId,
        programId,
      },
      order: [["position", "ASC"]],
    });
  }

  async updateSession(
    creatorId: string,
    sessionId: string,
    payload: any,
    transaction?: Transaction,
  ) {
    const activeTransaction = transaction ?? (await sequelize.transaction());
    const ownsTransaction = !transaction;

    try {
      const session = await Session.findOne({
        where: {
          id: sessionId,
          creatorId,
        },
        transaction: activeTransaction,
      });

      if (!session) {
        throw new Error("Session not found");
      }

      await session.update(payload, { transaction: activeTransaction });

      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "UPDATE_SESSION",
          entityType: "SESSION",
          entityId: session.id,
        },
        activeTransaction,
      );

      if (ownsTransaction) {
        await activeTransaction.commit();
      }

      return session;
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }

  async deleteSession(
    creatorId: string,
    sessionId: string,
    transaction?: Transaction,
  ) {
    const activeTransaction = transaction ?? (await sequelize.transaction());
    const ownsTransaction = !transaction;

    try {
      const session = await Session.findOne({
        where: {
          id: sessionId,
          creatorId,
        },
        transaction: activeTransaction,
      });

      if (!session) {
        throw new Error("Session not found");
      }

      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "DELETE_SESSION",
          entityType: "SESSION",
          entityId: session.id,
        },
        activeTransaction,
      );

      await session.destroy({ transaction: activeTransaction });

      if (ownsTransaction) {
        await activeTransaction.commit();
      }
    } catch (error) {
      if (ownsTransaction) {
        await activeTransaction.rollback();
      }

      throw error;
    }
  }
  async reorderSessions(
    creatorId: string,
    programId: string,
    sessionIds: string[],
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
        lock: activeTransaction.LOCK.UPDATE,
      });

      if (!program) {
        throw new Error("Program not found");
      }

      for (let index = 0; index < sessionIds.length; index++) {
        await Session.update(
          {
            position: index + 1,
          },
          {
            where: {
              id: sessionIds[index],
              creatorId,
              programId,
            },
            transaction: activeTransaction,
          },
        );
      }

      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "REORDER_SESSIONS",
          entityType: "PROGRAM",
          entityId: programId,
        },
        activeTransaction,
      );

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

export default new SessionService();
