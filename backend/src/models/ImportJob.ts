import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export class ImportJob extends Model<
  InferAttributes<ImportJob>,
  InferCreationAttributes<ImportJob>
> {
  declare id: CreationOptional<string>;

  declare creatorId: string;

  declare clientImportId: string;

  declare status: "STARTED" | "COMPLETED" | "FAILED";

  declare startedAt: CreationOptional<Date>;
  declare completedAt: CreationOptional<Date | null>;
  declare failureReason: CreationOptional<string | null>;
}

ImportJob.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // id of the creator of the import job, which is a foreign key to the users table
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: "import_job_creator_client_import",
    },

    // id of the client import, which is a unique identifier for the import job provided by the client
    clientImportId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "import_job_creator_client_import",
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "STARTED",
    },

    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "import_jobs",
    timestamps: true,
    updatedAt: false,
  },
);
