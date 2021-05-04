const express = require('express');
const router = express.Router();
const db=require('../config');
const {csrfProtection,asyncHandler}=require('./utils');
const { check, validationResult } = require("express-validator");
const { Answer, User, Question } = require('../db/models');


router.get('/', asyncHandler(async(req, res, next)=>{
  // const questionId = req.params.id
  const question = await Question.findByPk(10, {include: User})
  // res.send('What happened to George Washington?')
console.log(question.userId)
  res.render('answer', {question} )
}))

router.post('/', asyncHandler(async(req, res, next)=>{
  console.log("body", req.body)
  const {content, questionId, userId} = req.body
  // const answers = await Answer.findByPk(questionId)
console.log(userId)
//   const answer = await Answer.build({
//     content,
//     questionId,
//     userId
//   })
  
//   await answer.save()
//   res.redirect('/')


}))

module.exports = router