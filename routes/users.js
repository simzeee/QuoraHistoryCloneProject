const express = require('express');
const router = express.Router();
const {User}=require('../db/models');
const db=require('../config');
const {csrfProtection,asyncHandler}=require('./utils');
const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator");



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
    //loginUser
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
    const {email,password}=req.body;

    let errors=[];
    const validatorErrors = validationResult(req);

    if(validatorErrors.isEmpty()){
      const user=await User.findOne({where:{email}});
      if(user!==null){
        const passwordMatch=await bcrypt.compare(password,user.hashedPassword.toString());

        if(passwordMatch){
          console.log('password matches')
          //loginUser
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
module.exports = router;
