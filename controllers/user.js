const { generateJWT } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const createUser = async (req, res) => {
  const body = req.body;
  const salt = bcrypt.genSaltSync();

  const user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, salt),
    img: body.img,
    role: body.role,
  });

  try {
    const emailExists = await User.findOne({ email: body.email });
    if (emailExists) {
      return res.status(400).json({
        ok: false,
        message: 'User already exists.',
        errors: 'custom error',
      });
    }

    await user.save();
    const token = await generateJWT(user.id);

    res.status(201).json({
      ok: true,
      user,
      token,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: 'Error creating user.',
      errors: err,
    });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(400).json({
        ok: false,
        message: 'The user with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no user with that Id.' },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'User successfully deleted',
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error eliminating the user.',
      errors: err,
    });
  }
};

const getUsers = async (req, res) => {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;

  try {
    const [users, counting] = await Promise.all([User.find({}, null, { limit, skip: from }), User.countDocuments({})]);

    res.status(200).json({
      ok: true,
      users,
      total: counting,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error loading users.',
      errors: err,
    });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const userFound = await User.findById(id);
    if (!userFound) {
      return res.status(400).json({
        ok: false,
        message: 'The user with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no user with that Id.' },
      });
    }

    if (userFound.email !== body.email) {
      const emailExists = await User.findOne({ email: body.email });
      if (emailExists) {
        return res.status(400).json({
          ok: false,
          message: 'Another user has already taken that email.',
          errors: 'custom error',
        });
      }
    }

    delete userFound.password;
    delete userFound.google;
    userFound.name = body.name;
    userFound.email = body.email;
    userFound.role = body.role;

    const updatedUser = await User.findByIdAndUpdate(id, userFound, { new: true });

    res.status(200).json({
      ok: true,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error when updating user.',
      errors: err,
    });
  }
};

module.exports = { createUser, deleteUser, getUsers, updateUser };
