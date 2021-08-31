let jwt = require('jsonwebtoken');
const {secret} = require('./models.js');

let checkToken = (req, res, next) => {
  if(!req.cookies){
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }

  let token = req.cookies['Auth']
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.username = decoded['username'];
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}
