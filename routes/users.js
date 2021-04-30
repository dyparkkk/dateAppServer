const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try{
            const users = await User.find({});
            res.json(users);
        } catch(err) {
            console.error(err);
            next(err);
        }
    })
    .post( async (req, res, next) => {
        try{
            const user = await User.create({
                name: req.body.name,
                age: req.body.age,
                phone: req.body.phone,
                mbti: req.body.mbti,  
            });
            console.log(user);
            res.status(201).json(user);
        } catch(err) {
            console.error(err);
            next(err);
        }
    });

router.get('/:id', async(req, res, next)=>{
    const message = "hihi";
    // res.render('chat', {message});
    res.redirect(`/users/chat`);
    
})

router.get('/chat', async(req, res, next) => {
    res.render('chat');
})


module.exports = router;