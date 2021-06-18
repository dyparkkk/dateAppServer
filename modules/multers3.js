const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
// aws.config.loadFromPath(__dirname + '/../config/s3.json');

const {AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION} = process.env;

aws.config.update({
    "accessKeyId": process.env.AWS_ACCESS_KEY,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": AWS_REGION,
});

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'dateappbucket',
        acl:'public-read',
        key: (req, file, cb)=>{
            const extension = path.extname(file.originalname)
            cb(null, 'profileimage/'+Date.now().toString()+extension);
        }
    })
    //,limits:{fileSize: 5* 1024 * 1024}
});

module.exports = upload