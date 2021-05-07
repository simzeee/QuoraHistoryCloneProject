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
      return queryInterface.bulkInsert(
        "Users",
        [
          {
            username: "demoUser",
            email: "demoUser@gmail.com",
            hashedPassword:
              "$2a$10$kEjKglPCIsGHq4mvosqXReU0eIp5m/iadOKonTOR1/7p8fJ9P5xzi",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "Jack88",
            email: "jack88@gmail.com",
            hashedPassword:
              "$2a$10$kEjKglPCIsGHq4mvosqXReU0eIp5m987gah/iadOKonTOR1/7p8fJ9P5xzi",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "John87",
            email: "john87@gmail.com",
            hashedPassword:
              "$2a$10$kEjKglPCIsGHq4mvosqXReU0eIp5sdfsdfm987gah/iadOKonTOR1/7p8fJ9P5xzi",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "Connor97",
            email: "Connor97@gmail.com",
            hashedPassword:
              "$2a$10$kEjKglPCIsGHq4mvosqXReU0eIp5mwer987gah/iadOKonTOR1/7p8fJ9P5xzi",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "Nick93",
            email: "nick93@gmail.com",
            hashedPassword:
              "$2a$10$kEjKglPCIsGHq4mvosqXReU0eIafgdsp5m987gah/iadOKonTOR1/7p8fJ9P5xzi",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", {
      id: { [Sequelize.Op.gt]: 0 },
    });
   
  }
};
