import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export class AuditLog extends Model<
  InferAttributes<AuditLog>,
  InferCreationAttributes<AuditLog>
> {
  declare id: CreationOptional<string>;

  declare creatorId: string;
  declare actorId: string;

  declare action: string;

  declare entityType: string;

  declare entityId: string;

  declare metadata: object;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: "audit_logs",
    timestamps: true,
    updatedAt: false,
  },
);
