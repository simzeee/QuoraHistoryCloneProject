'use strict';
module.exports = (sequelize, DataTypes) => {
  const Upvote = sequelize.define('Upvote', {
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    answerId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  Upvote.associate = function(models) {
    Upvote.belongsTo(models.User,{foreignKey:'userId'});
    Upvote.belongsTo(models.Question,{foreignKey:'questionId'});
    Upvote.belongsTo(models.Answer,{foreignKey:'answerId'});
    Upvote.belongsTo(models.Comment,{foreignKey:'commentId'});
  };
  return Upvote;
};