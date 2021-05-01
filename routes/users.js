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
                id: req.body.id,
                name: req.body.name,
                pwd: req.doby.pwd,
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