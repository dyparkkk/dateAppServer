const express = require('express');
const User = require('../schemas/user');
const multer = require('multer');
const upload = require('../modules/multers3');
const {isLoggedIn} = require('./islogin');

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

router.get('/user', isLoggedIn, async (req, res, next) => {
    try {
        res.json({
            id: req.user.id,
            name: req.user.name,
            profileUrl: req.user.profileUrl,
            friendList: req.user.friendList
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// say hi
router.get('/hi', async (req, res, next) => {
    try {
        if (req.user) {
            res.send(`hi ${req.user.name}`);
            console.log(req.user);
        }
        else {
            res.send("not login");
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.route('/addfriend', isLoggedIn)
    .post(async (req, res, next) => {
        try {
            const { id, name } = await User.findOne({ id: req.body.friendID });
            await User.findOneAndUpdate(
                { id: req.user.id },
                {
                    $addToSet: {
                        "friendList": {
                            friendID: id,
                            friendName: name,
                        }
                    }
                }, function (err, addfriend) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(addfriend);
                    }
                }
            )
            res.send("add friend");
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.post('/profile', isLoggedIn , upload.single('profile_picture'), async(req, res) => {
    try{
        console.log(req.file);
        await User.findOneAndUpdate(
            { id: req.user.id },
            {
                $addToSet: {
                    "profileUrl": {
                        url: req.file.location    
                    }
                }
            }, function (err, addfriend) {
                if (err) {
                    console.log(err);
                }
            }
        )
        res.json({
            success:true,
            url: req.file.location
        });
    } catch(err){
        console.error(error);
        next(error);
    }
});

router.post('/profiles', isLoggedIn, upload.array('profile_picture'), async(req, res) => {
    try{
        console.log(req.files);
    } catch(err){
        console.error(err);
        next(err);
    }
});

// router.post('/Selfintro', isLoggedIn, (req, res, next) => {
//     try{
        
//     } catch(error){
//         console.error(error);
//         next(error);
//     }
// })
    
    
module.exports = router;