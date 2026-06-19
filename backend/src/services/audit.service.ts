import { AuditLog } from "../models";
import { Op } from "sequelize";

class AuditService {
  async getLogs(
    creatorId: string,
    query: {
      action?: string;
      from?: string;
      to?: string;
    },
  ) {
    const where: any = {
      creatorId,
    };

    if (query.action) {
      where.action = query.action;
    }

    if (query.from || query.to) {
      where.createdAt = {};

      if (query.from) {
        where.createdAt[Op.gte] = new Date(query.from);
      }

      if (query.to) {
        where.createdAt[Op.lte] = new Date(query.to);
      }
    }

    return AuditLog.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
  }
}

export default new AuditService();
