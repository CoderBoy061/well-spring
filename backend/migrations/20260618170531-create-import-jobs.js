"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("import_jobs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      clientImportId: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("import_jobs", {
      fields: ["creatorId", "clientImportId"],
      type: "unique",
      name: "unique_import_per_creator",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("import_jobs");
  },
};
