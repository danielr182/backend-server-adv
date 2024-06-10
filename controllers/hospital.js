const Hospital = require('../models/hospital');

const createHospital = async (req, res) => {
  const body = req.body;

  const hospital = new Hospital({
    name: body.name,
    img: body.img,
    user: req.uid,
  });

  try {
    const hospitalExists = await Hospital.findOne({ name: body.name });
    if (hospitalExists) {
      return res.status(400).json({
        ok: false,
        message: 'Hospital already exists.',
        errors: 'custom error',
      });
    }

    await hospital.save();

    res.status(201).json({
      ok: true,
      hospital,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      ok: false,
      message: 'Error creating hospital.',
      errors: err.toString(),
    });
  }
};

const deleteHospital = async (req, res) => {
  const id = req.params.id;

  try {
    const hospitalDeleted = await Hospital.findByIdAndDelete(id);
    if (!hospitalDeleted) {
      return res.status(400).json({
        ok: false,
        message: 'The hospital with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no hospital with that Id.' },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Hospital successfully deleted',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error eliminating the hospital.',
      errors: err.toString(),
    });
  }
};

const getHospitals = async (req, res) => {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) === -1 ? null : Number(req.query.limit) || 5;

  try {
    const [hospitals, counting] = await Promise.all([
      Hospital.find({}, null, { limit, skip: from }).populate('user', 'name img'),
      Hospital.countDocuments({}),
    ]);

    res.status(200).json({
      ok: true,
      hospitals,
      total: counting,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error loading hospitals.',
      errors: err.toString(),
    });
  }
};

const getHospitalById = async (req, res) => {
  const id = req.params.id;

  try {
    const hospitalFound = await Hospital.findById(id).populate('user', 'name img');
    if (!hospitalFound) {
      return res.status(400).json({
        ok: false,
        message: 'The hospital with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no hospital with that Id.' },
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalFound
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error loading the hospital.',
      errors: err.toString(),
    });
  }
};

const updateHospital = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const hospitalFound = await Hospital.findById(id);
    if (!hospitalFound) {
      return res.status(400).json({
        ok: false,
        message: 'The hospital with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no hospital with that Id.' },
      });
    }

    hospitalFound.name = body.name;
    hospitalFound.user = req.uid;

    const updatedHospital = await Hospital.findByIdAndUpdate(id, hospitalFound, { new: true });

    res.status(200).json({
      ok: true,
      hospital: updatedHospital,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: 'Error updating the hospital.',
      errors: err.toString(),
    });
  }
};

module.exports = { createHospital, deleteHospital, getHospitals, getHospitalById, updateHospital };
