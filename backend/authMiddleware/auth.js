const jwt = require('jsonwebtoken');
const secretKey = "maticzSecretKey";

const authMiddleware = (req, res, next) => {
  try{
    console.log("req headers-----", req.headers);

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(403)
        .json({message:"unauth no token provided"})
    };

    const token = authHeader.split(" ")[1];
    try{
      const decoded = jwt.verify(token, secretKey);
      // console.log("decoded------", decoded);      
      req.admin = decoded;
      next();
    } catch(err){
      return res.status(403).json({message: "ivalid or expired token", err})
    }
  }
  catch(err){
    console.log('err------------', err);
    
    return res.status(500).json({message: "server error", err})
  }
}

module.exports = { authMiddleware };