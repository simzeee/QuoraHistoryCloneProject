const express = require("express");
const router = express.Router();
const { User, Tag ,Question,QuestionTag} = require("../db/models");
const db = require("../config");
const { csrfProtection, asyncHandler } = require("./utils");

const { loginUser, logoutUser } = require("../auth");
const { check, validationResult } = require("express-validator");

const { Op } = require("sequelize");

router.get('/',csrfProtection,asyncHandler(async(req,res)=>{
    const Tags=await Tag.findAll();
    res.render('search',{
        Tags,
        csrfToken:req.csrfToken(),
    })

}));

router.post('/tags',csrfProtection,asyncHandler(async(req,res)=>{
    const result=req.body
    let id=[];
    let questions=[]
    const vals=Object.values(result)
    for(let i=0;i<vals.length-1;i++){
        id.push(parseInt(vals[i]))
    }
    console.log(id)
    let tags=await Tag.findAll({
        where:{id:[...id]},
        include:Question
        
    })
    for(let i=0;i<tags.length;i++){
        questions.push(tags[i].Questions[0])
    }
    // console.log(tags[0].Questions[0])
    res.render('search-result',{questions})
}));

router.post('/keyword',csrfProtection,asyncHandler(async(req,res)=>{
    const {searchBar}=req.body
    const results=await Question.findAll({
        where:{
            content:{
                [Op.substring]:searchBar
            }
        }
    })
    let questions=[];
    for(let i=0;i<results.length;i++){
        questions.push(results[i])
    }
    // console.log(results[0].content)
    res.render("search-result", { questions });
}))


module.exports = router;