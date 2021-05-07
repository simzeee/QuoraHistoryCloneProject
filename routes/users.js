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
      user,
      errors,
      csrfToken:req.csrfToken(),
    });
  }
}));

router.get('/login', csrfProtection, asyncHandler(async(req,res)=>{

  res.render('user-login',{
    csrfToken:req.csrfToken()
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

    }
    res.render('user-login',{
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
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render("userProfile", { user, csrfToken: req.csrfToken() });
  })
);

router.get(
  "/editPassword",
  restoreUser,
  requireAuth,
  csrfProtection,
  restoreUser,
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const user = await User.findByPk(userId);
    res.render("editPassword", { user , csrfToken:req.csrfToken()});
  })
);
const editPasswordValidator = [
  check("newPassword")
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
      if (value != req.body.newPassword) {
        throw new Error("Confirm password does not match the new password");
      }
      return true;
    }),
];

router.post(
  "/editPassword",
  editPasswordValidator,
  restoreUser,
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { password, newPassword, confirmPassword } = req.body;
    let errors = [];
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
      const userId = req.session.auth.userId;
      const user = await User.findByPk(userId);
      const passwordMatch = await bcrypt.compare(
        password,
        user.hashedPassword.toString()
      );
      if(passwordMatch){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ hashedPassword });
        return res.redirect("/");
      }else{
        errors.push('please enter valid current password');
        return res.render('editPassword',{errors, csrfToken:req.csrfToken()})
      }
    }else{
      errors = validationErrors.array().map((error) => error.msg);
      res.render('editPassword',{errors,csrfToken:req.csrfToken()})
    }
  })
);
router.post('/editProfile',csrfProtection,asyncHandler(async(req,res)=>{

}))

router.post('/demoLogin', csrfProtection, asyncHandler(async(req, res)=>{
  const userId = 1;
  const demoUser = await User.findByPk(userId);
  preventDefault()
  loginUser(req, res, demoUser);
  return res.redirect('/');
}))
module.exports = router;
