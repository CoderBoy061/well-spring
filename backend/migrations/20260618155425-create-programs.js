"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("programs", {
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

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("programs", ["creatorId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("programs");
  },
};
