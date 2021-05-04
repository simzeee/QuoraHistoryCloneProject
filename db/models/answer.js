'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER
  }, {});
  Answer.associate = function(models) {
    // associations can be defined here
    Answer.belongsTo(models.Question, {foreignKey: 'questionId'})
  };
  return Answer;
};