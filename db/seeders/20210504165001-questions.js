'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Questions", [
      {
        content: "When did the Renaissance start?",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: "What were the main events of the Dark Ages?",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'What time period is considered "ancient" history?',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: "What caused the Bronze Age Collapse? What the heck were the \"sea people\"?",
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Questions", {
      id: { [Sequelize.Op.gt]: 0 },
    });
  }
};
