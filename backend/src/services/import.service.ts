import fs from "fs";
import csv from "csv-parser";
import { UniqueConstraintError, Transaction } from "sequelize";

import { ImportJob, Program, Session } from "../models";
import { createAuditLog } from "../utils/audit";
import { sequelize } from "../config/database";

const REQUIRED_HEADERS = ["title", "duration", "instructorName"] as const;

type CsvRow = {
  title?: string;
  duration?: string;
  instructorName?: string;
  mediaUrl?: string;
  tags?: string;
};

type ImportResult = {
  successCount: number;
  failedRows: Array<{ row: number; reason: string }>;
  message?: string;
};

class ImportService {
  async importSessions(
    creatorId: string,
    programId: string,
    clientImportId: string,
    filePath: string,
  ): Promise<ImportResult> {
    const rows: CsvRow[] = [];
    let parsedHeaders: string[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
          }),
        )
        .on("headers", (headers: string[]) => {
          parsedHeaders = headers;
        })
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    const missingHeaders = REQUIRED_HEADERS.filter(
      (header) => !parsedHeaders.includes(header),
    );

    if (missingHeaders.length > 0) {
      throw new Error(
        `Invalid CSV headers. Missing required columns: ${missingHeaders.join(", ")}`,
      );
    }

    const failedRows: Array<{ row: number; reason: string }> = [];
    const validRows: Array<{
      title: string;
      duration: number;
      instructorName: string;
      mediaUrl: string | null;
      tags: string[];
    }> = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const missingFields = REQUIRED_HEADERS.filter((field) => {
        const value = row[field];

        return !value || !value.toString().trim();
      });

      if (missingFields.length > 0) {
        failedRows.push({
          row: index + 2,
          reason: `Missing required fields: ${missingFields.join(", ")}`,
        });
        continue;
      }

      const duration = Number(row.duration);

      if (!Number.isFinite(duration) || duration <= 0) {
        failedRows.push({
          row: index + 2,
          reason: "Invalid duration. Expected a positive number",
        });
        continue;
      }

      validRows.push({
        title: row.title!.trim(),
        duration,
        instructorName: row.instructorName!.trim(),
        mediaUrl: row.mediaUrl?.trim() || null,
        tags: row.tags
          ? row.tags.split(",").map((tag: string) => tag.trim())
          : [],
      });
    }

    const transaction = await sequelize.transaction();
    try {
      const [importJob, created] = await ImportJob.findOrCreate({
        where: {
          creatorId,
          clientImportId,
        },
        defaults: {
          creatorId,
          clientImportId,
          status: "STARTED",
          startedAt: new Date(),
        },
        transaction,
      });

      if (!created) {
        if (importJob.status === "COMPLETED") {
          await transaction.commit();
          return {
            successCount: 0,
            failedRows,
            message: "Import already processed",
          };
        }

        throw new Error("Import already in progress or previously failed");
      }

      const program = await Program.findOne({
        where: {
          id: programId,
          creatorId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!program) {
        await importJob.update(
          {
            status: "FAILED",
            completedAt: new Date(),
            failureReason: "Program not found",
          },
          { transaction },
        );
        await transaction.commit();
        throw new Error("Program not found");
      }

      const maxPosition = await Session.max("position", {
        where: {
          creatorId,
          programId,
        },
        transaction,
      });

      let nextPosition = typeof maxPosition === "number" ? maxPosition + 1 : 1;
      const createdSessions = validRows.map((row) => ({
        creatorId,
        programId,
        title: row.title,
        duration: row.duration,
        instructorName: row.instructorName,
        mediaUrl: row.mediaUrl,
        tags: row.tags,
        position: nextPosition++,
      }));

      if (createdSessions.length) {
        await Session.bulkCreate(createdSessions, { transaction });
      }

      await importJob.update(
        {
          status: "COMPLETED",
          completedAt: new Date(),
          failureReason: null,
        },
        { transaction },
      );

      await createAuditLog(
        {
          creatorId,
          actorId: creatorId,
          action: "IMPORT_SESSIONS",
          entityType: "PROGRAM",
          entityId: programId,
        },
        transaction,
      );

      await transaction.commit();

      if (createdSessions.length === 0) {
        return {
          successCount: 0,
          failedRows,
          message:
            failedRows.length > 0
              ? "Import failed. No valid rows were found in the CSV."
              : "Import failed. The CSV file did not contain any data rows.",
        };
      }

      return {
        successCount: createdSessions.length,
        failedRows,
      };
    } catch (error: any) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        return {
          successCount: 0,
          failedRows,
          message: "Import already processed",
        };
      }

      throw error;
    }
  }
}

export default new ImportService();
