const express = require('express');
const router = express.Router();
const { User } = require("../db/models");
const { db } = require("../config");
const { csrfProtection, asyncHandler } = require("./utils");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {
  if (req.session.auth) {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render('index', { title: 'Home Page', user});

  } else {
    console.log('got into the main page')
    res.render('index', { title: 'Home Page' });
  }
}));

module.exports = router;
