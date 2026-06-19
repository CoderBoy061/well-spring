import { Creator } from "./Creator";
import { Program } from "./Program";
import { AuditLog } from "./AuditLog";
import { Session } from "./Session";
import { ImportJob } from "./ImportJob";

Creator.hasMany(Program, {
  foreignKey: "creatorId",
});

Program.belongsTo(Creator, {
  foreignKey: "creatorId",
});
Session.belongsTo(Creator, {
  foreignKey: "creatorId",
});

export { Creator, Program, AuditLog, Session, ImportJob };
