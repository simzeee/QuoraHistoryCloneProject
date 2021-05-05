const express = require('express');
const router = express.Router();
const db = require('../config');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require("express-validator");
const { Answer, User, Question, Comment, Upvote } = require('../db/models');
const { restoreUser, requireAuth } = require('../auth');



router.get('/:id', restoreUser, requireAuth, asyncHandler(async (req, res, next) => {
  const questionId = parseInt(req.params.id, 10)
  const question = await Question.findByPk(questionId, { include: User });
  const answers = await Answer.findAll({
    where: { 'questionId': questionId },
    include: [User]
  });
  const questionUpvotes = await Upvote.findAll({
    where: { questionId },
  });
  const questionUpvote = { value: questionUpvotes.length };
  res.render('answer', { question, questionId, answers, questionUpvote })
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

router.post('/upvote/question', asyncHandler(async(req,res)=>{
  const {questionId,userId}=req.body
  const question = await Question.findByPk(questionId, { include: User });
  const answers = await Answer.findAll({
    where: { questionId: questionId },
    include: [User],
  });
  const previousUpvote=await Upvote.findOne({
    where:{
      userId,questionId
    }
  })
  if(previousUpvote!==null){
    await Upvote.destroy({
      where:{userId}
    })
  }else{
    await Upvote.create({
      userId,
      questionId
    })
  };
  const questionUpvotes=await Upvote.findAll({
    where:{questionId}
  });
  const questionUpvote={value:questionUpvotes.length};
  res.render("answer", { question, questionId, answers ,questionUpvote});
}));

router.get('/upvote/answer', asyncHandler(async(req,res)=>{


}));

module.exports = router
