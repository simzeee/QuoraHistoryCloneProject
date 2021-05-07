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
    return queryInterface.bulkInsert("QuestionTags", [
      { questionId: 1, tagId: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 2, tagId: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 3, tagId: 3, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 4, tagId: 6, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("QuestionTags", {
      id: { [Sequelize.Op.gt]: 0 },
    });
  }
};
