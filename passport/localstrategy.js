const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../schemas/user');

module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pwd',
    },async(id, pwd, done) =>{
        try{
            const exUser = await User.findOne({id: id});
            console.log(exUser);
            if(exUser){
                const result = await bcrypt.compare(pwd, exUser.pwd);
                if(result){
                    done(null, exUser);
                } else{
                    done(null, false, {
                        errorType: "wrongPassword",
                        message: '비밀번호가 일치하지않습니다. '});
                }
            } else{
                done(null, false, {
                    errorType: "notExist",
                    message: '가입되지 않은 유저입니다. '});
            }
        } catch(error){
            console.error(error);
            done(error);
        } 
    }));
};