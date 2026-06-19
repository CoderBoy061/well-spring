import { Request, Response } from "express";

import importService from "../services/import.service";

class ImportController {
  importSessions = async (req: Request, res: Response) => {
    try {
      const programId = Array.isArray(req.params.programId)
        ? req.params.programId[0]
        : req.params.programId;

      const clientImportId = Array.isArray(req.body.clientImportId)
        ? req.body.clientImportId[0]
        : req.body.clientImportId;

      if (!programId || !clientImportId || !req.file?.path) {
        return res.status(400).json({
          message: "programId, clientImportId, and file are required",
        });
      }

      const result = await importService.importSessions(
        req.creatorId!,
        programId,
        clientImportId,
        req.file.path,
      );

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };
}

export default new ImportController();
