'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    answerId: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Answer, { foreignKey: 'answerId' });
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.Question, { foreignKey: 'questionId' })
    Comment.hasMany(models.Upvote, { foreignKey: "commentId" });
  };
  return Comment;
};
