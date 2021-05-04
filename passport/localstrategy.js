const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../schemas/user');

module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    },async(id, password, done) =>{
        try{
            const exUser = await User.find({id: id}).exec();
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                } else{
                    done(null, false, {nessage: '비밀번호가 일치하지않습니다. '});
                }
            } else{
                done(null, false, {message: '가입되지 않은 유저입니다. '});
            }
        } catch(error){
            console.error(error);
            done(error);
        } 
    }));
};