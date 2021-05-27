const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const { MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL = `mongodb+srv://dyparkkk:${MONGO_PASSWORD}@cluster0.4tctp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const connectDB = ()=>{
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug', true);
    }
    mongoose.connect(MONGO_URL,{
        dbName: 'dateApp',
        useNewUrlParser: true,
        useCreateIndex: true,
    });
};
//     }, (error) => {
//         if(error){
//             console.log('몽고디비 연결 에러', error);
//         } else {
//             console.log('몽고디비 연결 성공');
//         }
//     });
// };

mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. db가 켜져있는지 확인해보세요');
    //connect();
  });
  
  module.exports = connectDB;
