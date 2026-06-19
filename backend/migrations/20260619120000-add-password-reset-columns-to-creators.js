"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("creators", "passwordResetToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("creators", "passwordResetExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("creators", "passwordResetExpires");
    await queryInterface.removeColumn("creators", "passwordResetToken");
  },
};
