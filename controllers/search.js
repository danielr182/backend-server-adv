const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');

const collectionSearch = async (req, res) => {
  const table = req.params.table;
  const search = req.params.search;
  const regex = new RegExp(search, 'i');
  let promise;

  switch (table) {
    case 'medics':
      promise = searchMedics(regex);
      break;
    case 'hospitals':
      promise = searchHospitals(regex);
      break;
    case 'users':
      promise = searchUsers(regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        message: 'Search types are only: users, medics, hospitals.',
        error: { message: 'Type of table/collection invalid.' },
      });
  }

  const data = await promise;

  res.status(200).json({
    ok: true,
    results: data,
  });
};

const generalSearch = async (req, res) => {
  const search = req.params.search;
  const regex = new RegExp(search, 'i');

  try {
    const [hospitals, medics, users] = await Promise.all([
      searchHospitals(regex),
      searchMedics(regex),
      searchUsers(regex),
    ]);

    res.status(200).json({
      ok: true,
      hospitals,
      medics,
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error obtaining data.',
      errors: err.toString(),
    });
  }
};

// Search functions
const searchHospitals = (regex) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hospitals = await Hospital.find({ name: regex }).populate('user', 'name img');
      resolve(hospitals);
    } catch (err) {
      reject('Error obtaining hospitals', err);
    }
  });
};

const searchMedics = (regex) => {
  return new Promise(async (resolve, reject) => {
    try {
      const medics = await Medic.find({ name: regex }).populate('user', 'name img').populate('hospital', 'name img');
      resolve(medics);
    } catch (err) {
      reject('Error obtaining medics', err);
    }
  });
};

const searchUsers = (regex) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({}, 'name email role').or([{ name: regex }, { email: regex }]);
      resolve(users);
    } catch (err) {
      reject('Error obtaining users', err);
    }
  });
};

module.exports = { collectionSearch, generalSearch };
