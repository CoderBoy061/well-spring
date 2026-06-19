"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("audit_logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      actorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      entityId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("audit_logs");
  },
};
