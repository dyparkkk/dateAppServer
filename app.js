const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
// const webSocket = require('./socket');
const connectDB = require('./schemas');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const testRouter = require('./routes/jsontest');
const passportConfig = require('./passport');


const app = express();
passportConfig();
app.set('port', process.env.PORT || 8081);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
connectDB();

const sessionOption = session({
    resave: false,
    saveUninirialized: false,
    secret: process.env.COOKIE_KEY,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    proxy: true,
});
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(sessionOption);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/jsontest', testRouter);


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} Not found`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'prodoction' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () =>{
    console.log(app.get('port'), '번 포트에서 대기중');
});