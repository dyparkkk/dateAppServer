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
        const user = await User.create({
            id: req.body.id,
            name: req.body.name,
            pwd: req.body.pwd,
        });
        return res.redirect('/');
    } catch(error){
        console.error(error);
        return next(error);
    }
});