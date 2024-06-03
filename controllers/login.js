const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const SEED = require('../config/config').SEED;
const User = require('../models/user');

// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

const googleAuth = async (req, res) => {
  const token = req.body.token;
  const googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      message: 'Token not valid',
    });
  });

  User.findOne({ email: googleUser.email }, (err, dbUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error when looking for user.',
        errors: err,
      });
    }

    if (dbUser) {
      if (dbUser.google === false) {
        return res.status(400).json({
          ok: false,
          message: 'You need to use your normal authentication.',
        });
      } else {
        const token = jwt.sign({ usuario: dbUser }, SEED, { expiresIn: 14400 }); // It expires in 4 hours

        res.status(200).json({
          ok: true,
          token: token,
          usuario: dbUser,
        });
      }
    } else {
      // The user does not exist, we should create it
      const user = new User();

      user.name = googleUser.name;
      user.email = googleUser.email;
      user.img = googleUser.img;
      user.google = true;
      user.password = 'D:';

      user.save((err, savedUser) => {
        const token = jwt.sign({ user: usuarioGuardado }, SEED, { expiresIn: 14400 }); // It expires in 4 hours

        res.status(200).json({
          ok: true,
          token: token,
          user: savedUser,
        });
      });
    }
  });
};

const userPassAuth = async (req, res) => {
  const body = req.body;

  try {
    const dbUser = await User.findOne({ email: body.email });
    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        message: 'Email not found.',
        errors: 'custom error',
      });
    }
    if (!bcrypt.compareSync(body.password, dbUser.password)) {
      return res.status(400).json({
        ok: false,
        message: 'Incorrect credentials.',
        errors: 'custom error',
      });
    }

    // // Create token
    const token = await generateJWT(dbUser.id);

    res.status(200).json({
      ok: true,
      token,
      user: dbUser,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error on standar login.',
      errors: err,
    });
  }
};

module.exports = { googleAuth, userPassAuth };
