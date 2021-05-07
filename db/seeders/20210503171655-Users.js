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
      return queryInterface.bulkInsert('Users', [
        {  username:'demoUser', email:'demoUser@gmail.com', hashedPassword:'$2a$10$kEjKglPCIsGHq4mvosqXReU0eIp5m/iadOKonTOR1/7p8fJ9P5xzi', createdAt:new Date(), updatedAt:new Date() }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", {
      id: { [Sequelize.Op.gt]: 0 },
    });
   
  }
};
