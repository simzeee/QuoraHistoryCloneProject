const express = require('express');
const router = express.Router();
const db = require('../config');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require("express-validator");
const { Answer, User, Question } = require('../db/models');
const { restoreUser, requireAuth } = require('../auth');



router.get('/:id', restoreUser, requireAuth, asyncHandler(async (req, res, next) => {
  const questionId = parseInt(req.params.id, 10)
  const question = await Question.findByPk(questionId, { include: User });
  const answers = await Answer.findAll({
    where: { 'questionId': questionId },
    include: [User]
  });

  res.render('answer', { question, questionId, answers })
}))

answerValidators = [
  check('content')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an answer.')
    .isLength({ max: 5000 })
    .withMessage('Please limit answer to 5000 characters')
]

router.post('/', restoreUser, requireAuth, answerValidators, asyncHandler(async (req, res, next) => {
  console.log("body", req.body)
  const { content, questionId } = req.body
  const userId = req.session.auth.userId;
  const validatorErrors = validationResult(req);
  let errors = []
  console.log("question ID", questionId)

  if (validatorErrors.isEmpty()) {
    const newAnswer = await Answer.create({
      content, userId, questionId
    });

    res.redirect('/')
  }
}))

module.exports = router
