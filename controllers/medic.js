const Medic = require('../models/medic');
const Hospital = require('../models/hospital');

const createMedic = async (req, res) => {
  const body = req.body;

  const medic = new Medic({
    name: body.name,
    img: body.img,
    hospital: body.hospital,
    user: req.uid,
  });

  try {
    const hospitalFound = await Hospital.findById(body.hospital);
    if (!hospitalFound) {
      return res.status(400).json({
        ok: false,
        message: 'The hospital with the Id ' + body.hospital + ' does not exist.',
        errors: { message: 'There is no hospital with that Id.' },
      });
    }

    await medic.save();

    res.status(201).json({
      ok: true,
      medic,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: 'Error creating a medic.',
      errors: err,
    });
  }
};

const deleteMedic = async (req, res) => {
  const id = req.params.id;

  try {
    const medicDeleted = await Medic.findByIdAndDelete(id);
    if (!medicDeleted) {
      return res.status(400).json({
        ok: false,
        message: 'The medic with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no medic with that Id.' },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Medic successfully deleted',
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error eliminating the medic.',
      errors: err,
    });
  }
};

const getMedics = async (req, res) => {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;

  try {
    const [medics, counting] = await Promise.all([
      Medic.find({}, null, { limit, skip: from }).populate('user', 'name img').populate('hospital', 'name'),
      Medic.countDocuments({}),
    ]);

    res.status(200).json({
      ok: true,
      medics,
      total: counting,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error loading medics.',
      errors: err,
    });
  }
};

const updateMedic = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const medicFound = await Medic.findById(id);
    if (!medicFound) {
      return res.status(400).json({
        ok: false,
        message: 'The medic with the Id ' + id + ' does not exist.',
        errors: { message: 'There is no medic with that Id.' },
      });
    }
    const hospitalFound = await Hospital.findById(body.hospital);
    if (!hospitalFound) {
      return res.status(400).json({
        ok: false,
        message: 'The hospital with the Id ' + body.hospital + ' does not exist.',
        errors: { message: 'There is no hospital with that Id.' },
      });
    }

    medicFound.name = body.name;
    medicFound.hospital = body.hospital;
    medicFound.user = req.uid;

    const updatedMedic = await Medic.findByIdAndUpdate(id, medicFound, { new: true });

    res.status(200).json({
      ok: true,
      medic: updatedMedic,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error updating the medic.',
      errors: err,
    });
  }
};

module.exports = { createMedic, deleteMedic, getMedics, updateMedic };
