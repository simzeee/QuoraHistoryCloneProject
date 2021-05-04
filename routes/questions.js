const express = require('express');
const router = express.Router();
const { QuestionTag, Question, Tag } = require('../db/models');
const db = require('../config');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require("express-validator");
const { restoreUser, requireAuth } = require('../auth');

router.get('/', csrfProtection, restoreUser, requireAuth, asyncHandler(async (req, res, next) => {
    const tags = await Tag.findAll();
    res.render('question-submit', { csrfToken: req.csrfToken(), tags });
}));

questionValidators = [
    check('content')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a question')
        .isLength({ max: 1000 })
        .withMessage('Please limit question to 1000 characters'),
    check('tagIds')
        .exists({ checkFalsy: true })
        .withMessage('Please select at least one tag')
];

router.post('/', csrfProtection, restoreUser, requireAuth, questionValidators, asyncHandler(async (req, res, next) => {
    const { content, tagIds } = req.body;
    const userId = req.session.auth.userId;
    const validatorErrors = validationResult(req);
    let errors = [];
    console.log(tagIds)

    if (validatorErrors.isEmpty()) {
        const newQuestion = await Question.create({ content, userId });
        const questionId = newQuestion.id;

        tagIds.forEach(async tagId => {
            await QuestionTag.create({ questionId, tagId });
        });

        res.redirect('/')
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
        console.log(errors)

        const tags = await Tag.findAll();
        res.render('question-submit', {
            csrfToken: req.csrfToken(),
            errors,
            content,
            tags
        });
    }
}));

module.exports = router;
