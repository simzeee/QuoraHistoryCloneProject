'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Upvotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{model:'Users'},
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{model:'Questions'},
      },
      answerId: {
        type: Sequelize.INTEGER,
        references:{model:'Answers'},
      },
      commentId: {
        type: Sequelize.INTEGER,
        references:{model:'Comments'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Upvotes');
  }
};