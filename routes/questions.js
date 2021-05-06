const express = require('express');
const router = express.Router();
const { QuestionTag, Question, Tag, User } = require('../db/models');
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

router.get('/:id(\\d+)/edit', csrfProtection, restoreUser, requireAuth, asyncHandler( async (req, res) => {
    const questionId = req.params.id;
    const question = await Question.findByPk(questionId, { include: [User] });
    const questionUserId = question.User.id;
    const currentUserId = req.session.auth.userId;

    if (questionUserId === currentUserId) {
        const content = question.content;
        const tags = await Tag.findAll();
        res.render('question-edit', { csrfToken: req.csrfToken(), question, tags });
    } else {
        res.render('index', { error: ['Unable to edit other users\' questions'] })
    }
}));

router.post('/:id(\\d+)/edit', csrfProtection, restoreUser, questionValidators, requireAuth, asyncHandler( async (req, res) => {
    let { content, tagIds } = req.body;
    const questionId = req.params.id;
    const question = await Question.findByPk(questionId);
    const validatorErrors = validationResult(req);
    let errors = [];
    if (!Array.isArray(tagIds)) {
        tagIds = [tagIds];
    }

    if (validatorErrors.isEmpty()) {
        question.content = content;
        await question.save();

        const questionTags = await QuestionTag.findAll({ where: { 'questionId': questionId } });
        questionTags.forEach(async questionTag => {
            await questionTag.update({ questionId, tagId });
        })

        res.redirect('/')
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
        console.log(errors)

        const tags = await Tag.findAll();
        res.render('question-edit', {
            csrfToken: req.csrfToken(),
            errors,
            question,
            tags
        });
    }
}));

router.get('/:id(\\d+)/delete', restoreUser, requireAuth, asyncHandler( async (req, res) => {
    const questionId = req.params.id;
    const question = await Question.findByPk(questionId, { include: [User] });

    if (question.User.id === req.session.auth.userId) {
        const questiontags = await QuestionTag.findAll({ where: { 'questionId': questionId }});
        questiontags.forEach(async questiontag => {
            await questiontag.destroy();
        });
        await question.destroy();

        res.redirect('/');
    } else {
        res.render('index', { error: ['Unable to delete other users\' questions'] })
    }
}));


module.exports = router;
