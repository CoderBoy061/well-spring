import { Program, Session } from "../models";
import { sequelize } from "../config/database";
import programService from "../services/program.service";
import sessionService from "../services/session.service";

describe("Tenant isolation", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects cross-tenant program access for program details", async () => {
    const findOneSpy = jest.spyOn(Program, "findOne").mockResolvedValue(null);

    const result = await programService.getProgramById(
      "tenant-abc",
      "program-123",
    );

    expect(result).toBeNull();
    expect(findOneSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "program-123",
          creatorId: "tenant-abc",
        },
      }),
    );
  });

  it("rejects cross-tenant program listing by enforcing creatorId", async () => {
    const findAllSpy = jest.spyOn(Program, "findAll").mockResolvedValue([]);

    await programService.getPrograms("tenant-abc");

    expect(findAllSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { creatorId: "tenant-abc" },
      }),
    );
  });

  it("rejects cross-tenant session listing by enforcing creatorId", async () => {
    const findAllSpy = jest.spyOn(Session, "findAll").mockResolvedValue([]);

    await sessionService.getSessions("tenant-abc", "program-123");

    expect(findAllSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          creatorId: "tenant-abc",
          programId: "program-123",
        },
      }),
    );
  });

  it("rejects cross-tenant session updates by enforcing creatorId on session lookup", async () => {
    const fakeTransaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
      LOCK: {
        UPDATE: "UPDATE",
      },
    } as any;

    jest.spyOn(sequelize, "transaction").mockResolvedValue(fakeTransaction);
    const findOneSpy = jest.spyOn(Session, "findOne").mockResolvedValue(null);

    await expect(
      sessionService.updateSession("tenant-abc", "session-123", {
        title: "New Title",
      }),
    ).rejects.toThrow("Session not found");

    expect(findOneSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "session-123",
          creatorId: "tenant-abc",
        },
        transaction: fakeTransaction,
      }),
    );
  });
});
