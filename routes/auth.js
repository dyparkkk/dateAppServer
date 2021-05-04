const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../schemas/user');

const router = express.Router();

router.post('/join', async(req, res, next) => {
    const {id,name, password} = req.body;
    try {
        const exUser = await (await User.findOne({id: `${id}`})).exec();
        if(exUser){
            res.send('중복');
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 8);
        await User.create({
            id:id,
            name: name,
            password: hash,
        });
        return res.redirect('/');
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
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;