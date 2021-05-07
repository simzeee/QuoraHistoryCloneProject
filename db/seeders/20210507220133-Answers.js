'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Answers", [
      {
        content:
          'The "sea people" were supposedly invaders from the north who were pushed south due to a possible drought and destruction of food sources. They swept through greece and moved south and were eventually were stopped by the Egyptians',
        userId: 2,
        questionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content:
          "I've always assumed the collapse was mainly due to political stagnation and the eventual death of empires lost to time.  Civilizations on decline plus some natural disaster can cause extinction of weak empires.",
        userId: 4,
        questionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content:
          "Maybe it was a bit of both?  Climate change triggered invasions by nomads from the north beset on weak and corrupt governments?",
        userId: 5,
        questionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: "Nick93 has a good point, I was thinking the same",
        userId: 3,
        questionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content:
          "It was so long ago and there isn't much records to go off of, much of it is speculation.",
        userId: 2,
        questionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content:
          "Still makes you wonder though, after the collapse there was a dark age and degredation of culture, I wonder how many times human societies have gone through this cycle of rise and fall that has gone unrecorded...really makes you think",
        userId: 3,
        questionId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Answers", {
      id: { [Sequelize.Op.gt]: 0 },
    });
  }
};
