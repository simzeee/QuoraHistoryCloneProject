const express = require('express');
const router = express.Router();
const { User, Question, Tag, QuestionTag, Upvote } = require("../db/models");
const { db } = require("../config");
const { csrfProtection, asyncHandler } = require("./utils");
const cookieParser = require("cookie-parser");
const { Op } = require("sequelize");
router.use(cookieParser());
const { restoreUser, requireAuth } = require("../auth");

/* GET home page. */
router.get(
  "/",
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const questions = await Question.findAll({
      include: [
        User,
        {
          model: Tag,
          through: QuestionTag,
        },
      ],
    });
    let upvoteCounts = [];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const id = questions[i].id;
      const upvoteCount = await Upvote.findAll({ where: { questionId: id } });
      question.upvotes = upvoteCount.length;
      upvoteCounts.push(upvoteCount.length);
    }
    questions.sort((a, b) => {
      return b.upvotes - a.upvotes;
    });
    const Tags = await Tag.findAll();
    // console.log(questions)
    if (req.session.authenticated) {
      const userId = req.session.auth.userId;
      const user = await User.findByPk(userId);

      res.render("index", {
        user,
        questions,
        Tags,
      });
    } else {
      res.render("index", {
        questions,
        Tags,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.post("/search/tags",csrfProtection,asyncHandler(async (req, res) => {
    const result = req.body;
    let id = [];
    let unfilteredQuestions = [];
    const vals = Object.values(result);
    for (let i = 0; i < vals.length - 1; i++) {
      id.push(parseInt(vals[i]));
    }

    let tags = await Tag.findAll({
      where: { id: [...id] },
      include: Question,
    });
    for (let i = 0; i < tags.length; i++) {
      if(tags[i].Questions){
        unfilteredQuestions.push(tags[i].Questions[0]);
      }else{return}
    };
    const questions=unfilteredQuestions.filter(question=>{
      if (question){return question}
    })
    if(questions.length){
      res.render("search-result", {
        questions,
        csrfToken: req.csrfToken(),

      });
    }else{
      res.render("search-result", {
        csrfToken: req.csrfToken(),

      });
    }
  })
);

router.post(
  "/search/keyword",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { searchBar } = req.body;
    const results = await Question.findAll({
      where: {
        content: {
          [Op.substring]: searchBar,
        },
      },
    });
    let questions = [];
    for (let i = 0; i < results.length; i++) {
      questions.push(results[i]);
    }

    res.render("search-result", { questions, csrfToken: req.csrfToken(), });
  })
);
router.get('/tags/:id(\\d+)',asyncHandler(async(req,res)=>{
  const tagId=req.params.id;
  const tag=await Tag.findByPk(tagId,{
    include:Question
  });
  let questions=[];
  tag.Questions.forEach((question) => {
    questions.push(question);
  });

  res.render("search-result", { questions });


}));
module.exports = router;
