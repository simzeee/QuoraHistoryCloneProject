const express = require('express');
const router = express.Router();
const { User, Question, Tag, QuestionTag, Upvote } = require("../db/models");
const { db } = require("../config");
const { csrfProtection, asyncHandler } = require("./utils");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {
  const questions = await Question.findAll({
    include: [ User, {
      model: Tag,
      through: QuestionTag},],
  });
  let upvoteCounts=[];
  for(let i=0;i<questions.length;i++){
    const question=questions[i];
    const id=questions[i].id;
    const upvoteCount=await Upvote.findAll({where:{questionId:id}});
    question.upvotes=upvoteCount.length;
    upvoteCounts.push(upvoteCount.length);
  }
  let sortedQuestions=[];
  let max=questions.shift();
  while(questions.length){
    const current=questions.shift();
    if(current.upvotes>max.upvotes){
      sortedQuestions.push(current)
    }else{
      sortedQuestions.push(max);
      max=current
    }
    if(questions.length){continue}
    else{sortedQuestions.push(current)}
  }
  
  if (req.session.authenticated) {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render('index', { title: 'Home Page', user, sortedQuestions });

  } else {
    res.render('index', { title: 'Home Page', sortedQuestions});
  }
}));

module.exports = router;
