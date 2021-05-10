const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../schemas/user');

const router = express.Router();

router.post('/join', async(req, res, next) => {
    const {id, name, pwd} = req.body;
    try {
        const exUser = await User.findOne({id: `${id}`});
        console.log(exUser);
        if(exUser){
            return res.json({
                success: false,
                errorType: "exist-user",
                message: "이미 존재하는 id입니다. "
            })
        }
        const hash = await bcrypt.hash(pwd, 8);
        await User.create({
            id:id,
            name: name,
            pwd: hash,
        });
        return res.json({
            success:true
        })
    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login',(req, res, next) => {
    passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.json({
                success:false,
                errorType: `loginError-${info.errorType}`,
                message:`${info.message}`
            });
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.json({
                success:true
            });
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    if(req.isAuthenticated()){
        req.logOut();
        req.session.destroy();
        res.json({
            success:true,

        });
    } else{
        res.json({
            success:false,
            errorType: "logoutError-notLogin",
            message:"로그인 필요"
        })
    }
});

module.exports = router;