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
                pwd: req.body.pwd,
            });
            console.log(user);
            res.status(201).json(user);
        } catch(err) {
            console.error(err);
            next(err);
        }
    });

router.get('/user', async(req, res, next)=> {
    try{
        if(req.user){
            res.json({
                name: req.user.name,
                friendList: req.user.friendList
            });
        } else{
            res.send("not login");
        }
    } catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/hi', async(req, res, next)=>{
    try{
        if(req.user){
            res.send(`hi ${req.user.name}`);
            console.log(req.user);
        }
        else {
            res.send("not login");
        }
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;