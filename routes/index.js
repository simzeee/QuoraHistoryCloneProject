const express = require('express');
const router = express.Router();
const { User, Question, Tag, QuestionTag } = require("../db/models");
const { db } = require("../config");
const { csrfProtection, asyncHandler } = require("./utils");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {
  const questions = await Question.findAll({
    include: [ User, {
      model: Tag,
      through: QuestionTag
    }],
  });

  if (req.session.authenticated) {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render('index', { title: 'Home Page', user, questions });

  } else {
    res.render('index', { title: 'Home Page', questions});
  }
}));

module.exports = router;
