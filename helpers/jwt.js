const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
      if (err) {
        console.log(err);
        reject('The JWT could not be generated');
      }
      resolve(token);
    });
  });
};

module.exports = { generateJWT };
