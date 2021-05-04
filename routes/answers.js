const express = require('express');
const router = express.Router();
const db=require('../config');
const {csrfProtection,asyncHandler}=require('./utils');
const { check, validationResult } = require("express-validator");
const { Answer, User, Question } = require('../db/models');
const { restoreUser, requireAuth } = require('../auth');



router.get('/:id', restoreUser, requireAuth, asyncHandler(async(req, res, next)=>{
  const questionId = parseInt(req.params.id, 10)
  const question = await Question.findByPk(questionId, {include: User})
  // console.log(questionId)
  // const currentAnswer = await Answer.findAll({
  //   where: {
  //     questionId: 10
  //   },
    
  // })
  // console.log("current Answer", currentAnswer)
  
// console.log(question.userId)
  res.render('question', {question, questionId} )
}))

answerValidators = [
  check('content')
        .exists({ checkFalsy: true })
        .withMessage('Please provide an answer.')
        .isLength({ max: 5000 })
        .withMessage('Please limit answer to 5000 characters')
]

router.post('/', restoreUser, requireAuth, answerValidators, asyncHandler(async(req, res, next)=>{
  console.log("body", req.body)
  const {content, questionId} = req.body
  const userId = req.session.auth.userId;
  const validatorErrors = validationResult(req);
  let errors = []
  console.log("question ID", questionId)

  if (validatorErrors.isEmpty()) {
    const newAnswer = await Answer.build({ 
      content, userId, questionId });
    
      await newAnswer.save()

    res.redirect('/')
} 

  const answers = await Answer.findByPk(questionId)
  const answer = await Answer.build({
    content,
    questionId,
    userId
  })
  


}))

module.exports = router