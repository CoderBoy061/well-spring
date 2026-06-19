import fs from "fs";
import os from "os";
import path from "path";

const mockImportJob = {
  findOrCreate: jest.fn(),
};
const mockProgram = {
  findOne: jest.fn(),
};
const mockSession = {
  max: jest.fn(),
  bulkCreate: jest.fn(),
};

jest.mock("../models", () => ({
  ImportJob: mockImportJob,
  Program: mockProgram,
  Session: mockSession,
}));

jest.mock("../utils/audit", () => ({
  createAuditLog: jest.fn(),
}));

jest.mock("../config/database", () => ({
  sequelize: {
    transaction: jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn(),
      LOCK: {
        UPDATE: "UPDATE",
      },
      finished: undefined,
    }),
  },
}));

import importService from "../services/import.service";

describe("Import idempotency", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns already processed when the same clientImportId is reused", async () => {
    const csvPath = path.join(os.tmpdir(), `import-${Date.now()}.csv`);
    fs.writeFileSync(
      csvPath,
      "title,duration,instructorName\nTest Session,30,Teacher\n",
    );

    mockImportJob.findOrCreate.mockResolvedValue([
      { status: "COMPLETED" },
      false,
    ]);

    const result = await importService.importSessions(
      "tenant-abc",
      "program-123",
      "import-1",
      csvPath,
    );

    expect(result.message).toContain("Import already processed");
    expect(mockImportJob.findOrCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          creatorId: "tenant-abc",
          clientImportId: "import-1",
        },
      }),
    );

    fs.unlinkSync(csvPath);
  });
});
