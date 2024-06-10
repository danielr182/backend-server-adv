const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFront } = require('../helpers/menu-front');
const User = require('../models/user');

const googleAuth = async (req, res) => {
  try {
    const googleUser = await googleVerify(req.body.token);
    const dbUser = await User.findOne({ email: googleUser.email });
    let user;

    if (dbUser) {
      user = dbUser;
      user.google = true;
    } else {
      user = new User({
        email: googleUser.email,
        google: true,
        img: googleUser.picture,
        name: googleUser.name,
        password: '@',
      });
    }

    await user.save();
    const jwt = await generateJWT(user.id);

    res.status(200).json({
      ok: true,
      token: jwt,
      user,
      menu: getMenuFront(user.role),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error in google auth.',
      errors: err.toString(),
    });
  }
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

    // Create token
    const jwt = await generateJWT(dbUser.id);

    res.status(200).json({
      ok: true,
      token: jwt,
      user: dbUser,
      menu: getMenuFront(dbUser.role),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error on standar login.',
      errors: err.toString(),
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  const token = await generateJWT(uid);
  const user = await User.findById(uid);

  res.status(200).json({
    ok: true,
    token,
    user,
    menu: getMenuFront(user.role),
  });
};

module.exports = { googleAuth, userPassAuth, renewToken };
