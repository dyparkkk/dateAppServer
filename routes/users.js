const express = require('express');
const User = require('../schemas/user');
const multer = require('multer');
const upload = require('../modules/multers3');

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
                id: req.user.id,
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

// say hi
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

router.route('/addfriend')
    .post(async(req, res, next)=> {
        try{
            if(req.user){
                const {id, name} = await User.findOne({id:req.body.friendID});
                await User.findOneAndUpdate(
                    { id:req.user.id },
                    {
                        $addToSet:{
                            "friendList":{
                                friendID:id,
                                friendName:name,
                            }
                        }
                    }, function(err, addfriend){
                            if(err){
                                console.log(err);
                            } else {
                                console.log(addfriend);
                            }
                        }
                )
                res.send("add friend");
            } else{
                // not login
                console.log("not login");
                res.send("not login");
            }
            
        } catch(err){
            console.error(err);
            next(err);
        }
    });

    
router.post('/profile', upload.single('profile_picture'), (req, res) => {
    try{
        console.log(req.file);
        res.json({
            success:true,
            url: req.file.location
        });
    } catch(err){
        console.error(error);
        next(error);
    }
});

    

module.exports = router;