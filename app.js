const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const socketio = require('socket.io');

dotenv.config();
// middleware 
const connectDB = require('./schemas');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const testRouter = require('./routes/jsontest');  //삭제 예정
const passportConfig = require('./passport');

// server definition
const app = express();
const server = http.createServer(app);
const io = socketio(server).sockets;

passportConfig();
app.set('port', process.env.PORT || 8081);
// app.set('view engine', 'html');
// nunjucks.configure('views', {
//     express: app,
//     watch: true,
// });
connectDB();

const sessionOption = session({
    resave: false,
    saveUninirialized: false,
    secret: process.env.COOKIE_KEY,
    cookie: {
        secure: false,
        // httpOnly: true,
    },
    // proxy: true,
});
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
} else {
    app.use(morgan('common'));
}
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(sessionOption);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/jsontest', testRouter);  //삭제예정

require('./socket.js')(io);

// error handling
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} Not found`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.send( err || 'Error !! ');
});

server.listen(app.get('port'), () =>{
    console.log(app.get('port'), '번 포트에서 대기중');
});