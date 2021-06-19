exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('login neccesory');
    }
};
// logout 
// exports.isNotLoggedIn = (req, res, next) => {
//     if(!req.isAuthenticated()) {
//         next();
//     }
// }
