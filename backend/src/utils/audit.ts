import { AuditLog } from "../models/AuditLog";
import { Transaction } from "sequelize";

export const createAuditLog = async (
  {
    creatorId,
    actorId,
    action,
    entityType,
    entityId,
    metadata = {},
  }: {
    creatorId: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: object;
  },
  transaction?: Transaction,
) => {
  await AuditLog.create(
    {
      creatorId,
      actorId,
      action,
      entityType,
      entityId,
      metadata,
    },
    { transaction },
  );
};
