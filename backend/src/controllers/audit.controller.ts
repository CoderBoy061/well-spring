import { Request, Response } from "express";

import auditService from "../services/audit.service";

class AuditController {
  getLogs = async (req: Request, res: Response) => {
    const logs = await auditService.getLogs(req.creatorId!, req.query as any);

    return res.json(logs);
  };
}

export default new AuditController();
