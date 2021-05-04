'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Question, {
      through: 'QuestionTag',
      otherKey: 'tagId',
      foreignKey: 'questionId'
    })
  };
  return Tag;
};
