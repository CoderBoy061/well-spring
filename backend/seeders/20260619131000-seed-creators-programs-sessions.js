"use strict";

const { randomUUID } = require("crypto");
const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Create 2 creators
    const creators = [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "Creator One",
        email: "creator1@example.com",
        password: "$2b$10$examplehashedpassword1",
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        name: "Creator Two",
        email: "creator2@example.com",
        password: "$2b$10$examplehashedpassword2",
        passwordResetToken: null,
        passwordResetExpires: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Idempotent: remove existing rows for these creators if present
    const creatorIds = creators.map((c) => c.id);
    const creatorEmails = creators.map((c) => c.email);

    await queryInterface.bulkDelete(
      "sessions",
      { creatorId: { [Sequelize.Op.in]: creatorIds } },
      {},
    );

    await queryInterface.bulkDelete(
      "programs",
      { creatorId: { [Sequelize.Op.in]: creatorIds } },
      {},
    );

    await queryInterface.bulkDelete(
      "creators",
      {
        [Sequelize.Op.or]: [
          { id: { [Sequelize.Op.in]: creatorIds } },
          { email: { [Sequelize.Op.in]: creatorEmails } },
        ],
      },
      {},
    );

    await queryInterface.bulkInsert("creators", creators);

    // Create 3 programs per creator (6 total)
    const programs = [];
    const sessions = [];

    const programsPerCreator = 3;
    const sessionsPerProgram = 10;

    for (const creator of creators) {
      for (let p = 1; p <= programsPerCreator; p++) {
        const programId = randomUUID();
        const program = {
          id: programId,
          creatorId: creator.id,
          title: `Program ${p} for ${creator.name}`,
          description: `Sample description for program ${p}`,
          createdAt: now,
          updatedAt: now,
        };

        programs.push(program);

        // Create sessions for this program
        for (let s = 1; s <= sessionsPerProgram; s++) {
          const sessionId = randomUUID();
          sessions.push({
            id: sessionId,
            creatorId: creator.id,
            programId: programId,
            title: `Session ${s} of ${program.title}`,
            duration: 15 + s,
            position: s,
            instructorName: `Instructor ${s}`,
            mediaUrl: null,
            tags: Sequelize.literal(`'${JSON.stringify(["demo"])}'::jsonb`),
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    if (programs.length) {
      await queryInterface.bulkInsert("programs", programs);
    }

    if (sessions.length) {
      await queryInterface.bulkInsert("sessions", sessions);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("sessions", null, {});
    await queryInterface.bulkDelete("programs", null, {});
    await queryInterface.bulkDelete("creators", null, {});
  },
};
