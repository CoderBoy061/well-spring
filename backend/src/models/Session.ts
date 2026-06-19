import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<string>;

  declare creatorId: string;
  declare programId: string;

  declare title: string;
  declare duration: number;
  declare position: number;

  declare instructorName: string;

  declare mediaUrl: string | null;

  declare tags: string[];
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // id of the creator of the session, which is a foreign key to the users table
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // id of the program to which the session belongs, which is a foreign key to the programs table
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    instructorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "sessions",
    timestamps: true,
  },
);
