const express = require('express');
const router = express.Router();
const {User}=require('../db/models');
const db=require('../config');
const {csrfProtection,asyncHandler}=require('./utils');
const bcrypt = require("bcryptjs");
const {loginUser,logoutUser}=require('../auth');
const { check, validationResult } = require("express-validator");
const { restoreUser, requireAuth } = require('../auth');




/* GET users listing. */
router.get('/register',csrfProtection, asyncHandler(async(req, res, next)=> {
  const user=User.build();
  res.render('user-register',{
    title: 'Register',
    user,
    csrfToken:req.csrfToken(),
  });
}));

const registerValidation = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please enter User Name")
    .isLength({ max: 50 })
    .withMessage("Please provide a User Name no longer than 50 characters"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide an email address")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 255 })
    .withMessage(
      "Please provide an email address no longer than 255 characters"
    )
    .custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(
            "The provided email address is already in use by another account."
          );
        }
      });
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password")
    .isLength({ max: 50 })
    .withMessage("Please provide a password no longer than 50 characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/, "g")
    .withMessage(
      "Please include a lowercase letter, uppercase letter, number, and special character"
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password confirmation")
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Confirm password does not match password");
      }
      return true;
    }),
];

router.post('/register',registerValidation,csrfProtection,asyncHandler(async(req,res,next)=>{
  const {username,email,password}=req.body;
  const user=User.build({
    username,email
  });
  const validatorErrors=validationResult(req);
  if(validatorErrors.isEmpty()){
    const hashedPassword= await bcrypt.hash(password,10);
    user.hashedPassword= hashedPassword;
    await user.save();
    loginUser(req,res,user);
    res.redirect('/');
  } else {
    const errors= validatorErrors.array().map((error)=>error.msg);
    res.render('user-register',{
      title:'Register',
      user,
      errors,
      csrfToken:req.csrfToken(),
    });
  }
}));

router.get('/login', csrfProtection, asyncHandler(async(req,res)=>{

  res.render('user-login',{
    csrfToken:req.csrfToken(),
    title:'Log In',
  })
}));

const loginValidators=[
  check('email')
    .exists({checkFalsy:true})
    .withMessage('Please provide valid email address'),
  check('password')
    .exists({checkFalsy:true})
    .withMessage('Please provide a password'),
];

router.post('/login', csrfProtection, loginValidators, asyncHandler(async(req,res,next)=>{
    const { email, password }=req.body;

    let errors=[];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const user = await User.findOne({ where: { email } });
      if( user !== null ){
        const passwordMatch=await bcrypt.compare(password,user.hashedPassword.toString());

        if(passwordMatch){
          const username = user.username;
          loginUser(req,res,user)
          return res.redirect('/')
        }
      }
      errors.push('Login failed for the provided email address.')
    } else {
      errors= validatorErrors.array().map((error)=>error.msg);
      console.log(errors)
    }
    res.render('user-login',{
      title:'Log In',
      email,
      errors,
      csrfToken:req.csrfToken(),
    })
}));

router.post('/logout',(req,res)=>{
  logoutUser(req,res);
  res.redirect('/')
})

router.get(
  "/userProfile",
  restoreUser,
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render("userProfile", { user });
  })
);

router.get(
  "/editUserName",
  csrfProtection,
  restoreUser,
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render("editUserName", { user, csrfToken: req.csrfToken() });
  })
);

router.get(
  "/editPassword",
  csrfProtection,
  restoreUser,
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render("editPassword", { user, csrfToken: req.csrfToken() });
  })
);
const updateUserNameValidation = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please enter User Name")
    .isLength({ max: 50 })
    .withMessage("Please provide a User Name no longer than 50 characters"),
];
const updatePasswordValidation = [
  check("newPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password")
    .isLength({ max: 50 })
    .withMessage("Please provide a password no longer than 50 characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/, "g")
    .withMessage(
      "Please include a lowercase letter, uppercase letter, number, and special character"
    ),
];
router.post(
  "/editUserName",
  csrfProtection,
  restoreUser,
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    const { username } = req.body;
    await user.update({ username });
    res.render("userProfile", { user });
    
  })
);
router.post(
  "/editPassword",
  csrfProtection,
  restoreUser,
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    const { password, newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.update({
      hashedPassword:hashedNewPassword
    });
    res.render("userProfile", { user });
  })
);
module.exports = router;
