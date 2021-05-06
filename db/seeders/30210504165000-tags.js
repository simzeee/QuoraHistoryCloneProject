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
    return queryInterface.bulkInsert('Tags', [
      { name: 'Renaissance', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dark Ages', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ancient', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Enlightenment', createdAt: new Date(), updatedAt: new Date() },
      { name: 'U.S. History', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bronze Age', createdAt: new Date(), updatedAt: new Date() },
      { name: 'World War I', createdAt: new Date(), updatedAt: new Date() },
      { name: 'World War II', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tags", {
      id: { [Sequelize.Op.gt]: 0 },
    });
  }
};
