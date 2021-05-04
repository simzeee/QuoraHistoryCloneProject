const express = require('express');
const router = express.Router();
const { User, Tag }=require('../db/models');
const db=require('../config');
const {csrfProtection,asyncHandler}=require('./utils');
const bcrypt = require("bcryptjs");
const {loginUser,logoutUser}=require('../auth');
const { check, validationResult } = require("express-validator");




/* GET questions form. */
router.get('/', csrfProtection, asyncHandler( async (req, res, next)=> {
    const tags = await Tag.findAll();
    res.render('question-submit', { csrfToken: req.csrfToken(), tags } );
}));

router.post('/', csrfProtection, asyncHandler( async (req, res, next)=> {
    // const { content, tag }
}));

module.exports = router;
