const express = require('express');
const router = express.Router();
const {User}=require('../db/models');
const db=require('../config');
const {csrfProtection,asyncHandler}=require('./utils');
const bcrypt = require("bcryptjs");
const {loginUser,logoutUser}=require('../auth');
const { check, validationResult } = require("express-validator");




/* GET questions forms. */
router.get('/', csrfProtection, asyncHandler( async (req, res, next)=> {
    res.render('question-submit', { csrfToken: req.csrfToken()} );
}));

router.post('/', csrfProtection, asyncHandler( async (req, res, next)=> {
    // res.render('');
}));

module.exports = router;
