const { decodeToken: decodeToken,decodeTokenForId:decodeTokenForId } = require('../util/token');
const authorization = (req, res, next) => {
  
    const authHeader = req.headers['authorization'];
  
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('UnAuthorization')
    } 
   var decode =  decodeToken(token)
   var decodeId =  decodeTokenForId(token)

   req.currentUserId = decodeId.id;
    if(decode == false){
        return res.status(401).send('UnAuthorization')
    }
    console.log(decode);
    next();

    }; 

module.exports = authorization;