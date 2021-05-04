const express = require("express");
const router = express.Router();
const { User, Tag ,Question,QuestionTag} = require("../db/models");
const db = require("../config");
const { csrfProtection, asyncHandler } = require("./utils");

const { loginUser, logoutUser } = require("../auth");
const { check, validationResult } = require("express-validator");



router.get('/',csrfProtection,asyncHandler(async(req,res)=>{
    const Tags=await Tag.findAll();
    res.render('search',{
        Tags,
        csrfToken:req.csrfToken(),
    })

}));

router.post('/tag',csrfProtection,asyncHandler(async(req,res)=>{
    const result=req.body
    let id=[];
    let questions=[]
    const vals=Object.values(result)
    for(let i=0;i<vals.length-1;i++){
        id.push(parseInt(vals[i]))
    }
    // console.log(id)
    let tags=await Tag.findAll({
        where:{id:[...id]},
        include:Question
    })
    for(let i=0;i<tags.length;i++){
        questions.push(tags[i].Questions[0].content)
    }
    // console.log(tags[0].Questions[0])
    res.render('search-result',{questions})
}));
router.post("/keyword",csrfProtection,asyncHandler(async (req, res) => {





}));



module.exports = router;