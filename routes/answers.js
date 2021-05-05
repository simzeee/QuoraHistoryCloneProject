const express = require('express');
const router = express.Router();
const db = require('../config');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require("express-validator");
const { Tag, Answer, User, Question, Comment } = require('../db/models');
const { restoreUser, requireAuth } = require('../auth');


// :id is the question ID
router.get('/:id', restoreUser, requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const questionId = parseInt(req.params.id, 10)
  const question = await Question.findByPk(questionId, { include: [User, Tag] });
  const answers = await Answer.findAll({
    where: { 'questionId': questionId },
    include: [User]
  });
  const comments = await Comment.findAll({
    where: { 'questionId': questionId },
    include: [User]
  });

  res.render('answer', { question, questionId, answers, comments, csrfToken: req.csrfToken() })
}))

// :id is the answer ID
router.get('/:id/comments', asyncHandler(async (req, res, next) => {
  const answerId = req.params.id;
  console.log(answerId)
  const answerComments = await Comment.findAll({
    where: { 'answerId': answerId },
    include: [User]
  });
  res.send({ answerComments, User });
}))

const commentValidator = [
  check('content')
    .exists()
    .withMessage('Please provide a comment')
    .isLength({ max: 255 })
    .withMessage('Please provide a comment less than 255 characters')
];

router.post('/:id/comments', restoreUser, requireAuth, csrfProtection, commentValidator, asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const validatorErrors = validationResult(req);
  let errors = [];

  if (validatorErrors.isEmpty()) {
    const answerId = req.params.id;
    const answer = await Answer.findByPk(answerId, { include: [Question] });
    const questionId = answer.Question.id;
    const userId = req.session.auth.userId;

    await Comment.create({ content, userId, answerId, questionId });

    res.redirect(`/answers/${answer.questionId}/`)

  } else {
    errors = validatorErrors.array().map((error) => error.msg);
    console.log(errors)
    res.redirect(`/answers/${answer.questionId}/`)
  }
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
