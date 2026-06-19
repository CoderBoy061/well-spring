"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sessions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "creators",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      programId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "programs",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      instructorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      mediaUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      tags: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("sessions", ["programId"]);

    await queryInterface.addIndex("sessions", ["creatorId"]);

    await queryInterface.addIndex("sessions", ["programId", "position"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("sessions");
  },
};
