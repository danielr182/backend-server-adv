const fs = require('fs');
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');

const uploadByType = async ({ file, type, idType, newFileName: fileName, res: response }) => {
  switch (type) {
    case 'users':
      try {
        const userFound = await User.findById(idType);
        if (!userFound) {
          return response.status(400).json({
            ok: false,
            message: 'The user with the Id ' + idType + ' does not exist.',
            errors: { message: 'There is no user with that Id.' },
          });
        }

        removePreviousFile(type, userFound.img);
        delete userFound.password;
        delete userFound.google;
        userFound.img = fileName;
        const updatedUser = await User.findByIdAndUpdate(idType, userFound, { new: true });
        moveFileToServerPath(file, type, fileName);

        response.status(200).json({
          ok: true,
          message: 'Updated user image.',
          user: updatedUser,
        });
      } catch (err) {
        return response.status(500).json({
          ok: false,
          message: 'Error looking for the user.',
          errors: err,
        });
      }
      break;
    case 'medics':
      try {
        const medicFound = await Medic.findById(idType);
        if (!medicFound) {
          return response.status(400).json({
            ok: false,
            message: 'The medic with the Id ' + idType + ' does not exist.',
            errors: { message: 'There is no medic with that Id.' },
          });
        }

        removePreviousFile(type, medicFound.img);
        medicFound.img = fileName;
        const updatedMedic = await Medic.findByIdAndUpdate(idType, medicFound, { new: true });
        moveFileToServerPath(file, type, fileName);

        response.status(200).json({
          ok: true,
          message: 'Updated medic image.',
          medic: updatedMedic,
        });
      } catch (err) {
        return response.status(500).json({
          ok: false,
          message: 'Error looking for the medic.',
          errors: err,
        });
      }
      break;
    case 'hospitals':
      try {
        const hospitalFound = await Hospital.findById(idType);
        if (!hospitalFound) {
          return response.status(400).json({
            ok: false,
            message: 'The hospital with the Id ' + idType + ' does not exist.',
            errors: { message: 'There is no hospital with that Id.' },
          });
        }
        
        removePreviousFile(type, hospitalFound.img);
        hospitalFound.img = fileName;
        const updatedHospital = await Hospital.findByIdAndUpdate(idType, hospitalFound, { new: true });
        moveFileToServerPath(file, type, fileName);

        response.status(200).json({
          ok: true,
          message: 'Updated hospital image.',
          hospital: updatedHospital,
        });
      } catch (err) {
        return response.status(500).json({
          ok: false,
          message: 'Error looking for the hospital.',
          errors: err,
        });
      }
      break;

    default:
      break;
  }
};

const moveFileToServerPath = (file, type, fileName) => {
  // Move the file to a server path
  const path = `./uploads/${type}/${fileName}`;
  file.mv(path, (err) => {
    if (err) {
      throw new Error('Error moving the file.');
    }
  });
};

const removePreviousFile = (type, fileName) => {
  const previousPath = `./uploads/${type}/${fileName}`;
  // If it exists, remove the previous file
  if (fs.existsSync(previousPath)) {
    fs.unlinkSync(previousPath, (err) => {
      if (err) {
        return response.status(500).json({
          ok: false,
          message: `Error eliminating the previous image of the ${type}.`,
          errors: err,
        });
      }
    });
  }
};

module.exports = { uploadByType };
