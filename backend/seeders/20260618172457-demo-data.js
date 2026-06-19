"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("creators", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Demo Creator",
        email: "demo@test.com",
        password: "$2b$10$...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("creators", null, {});
  },
};
