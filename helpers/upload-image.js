const fs = require('fs');
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');
const { del, put } = require('@vercel/blob');

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

        // removePreviousFile(type, userFound.img);
        try {
          await del(userFound.img);
        } catch (err) {
          console.log('Error deleting the file in the cloud: ', err.toString());
        }
        const blob = await put(`users/${fileName}`, file.data, {
          access: 'public',
        });
        delete userFound.password;
        delete userFound.google;
        userFound.img = blob.url;
        const updatedUser = await User.findByIdAndUpdate(idType, userFound, { new: true });
        // moveFileToServerPath(file, type, fileName);

        response.status(200).json({
          ok: true,
          message: 'Updated user image.',
          user: updatedUser,
        });
      } catch (err) {
        console.log(err);
        return response.status(500).json({
          ok: false,
          message: 'Error updating the user.',
          errors: err.toString(),
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

        // removePreviousFile(type, medicFound.img);
        try {
          await del(medicFound.img);
        } catch (err) {
          console.log('Error deleting the file in the cloud: ', err.toString());
        }
        const blob = await put(fileName, file.data, {
          access: 'public',
        });
        medicFound.img = blob.url;
        const updatedMedic = await Medic.findByIdAndUpdate(idType, medicFound, { new: true });
        // moveFileToServerPath(file, type, fileName);

        response.status(200).json({
          ok: true,
          message: 'Updated medic image.',
          medic: updatedMedic,
        });
      } catch (err) {
        console.log(err);
        return response.status(500).json({
          ok: false,
          message: 'Error updating the medic.',
          errors: err.toString(),
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

        // removePreviousFile(type, hospitalFound.img);
        try {
          await del(hospitalFound.img);
        } catch (err) {
          console.log('Error deleting the file in the cloud: ', err.toString());
        }
        const blob = await put(fileName, file.data, {
          access: 'public',
        });
        hospitalFound.img = blob.url;
        const updatedHospital = await Hospital.findByIdAndUpdate(idType, hospitalFound, { new: true });
        // moveFileToServerPath(file, type, fileName);

        response.status(200).json({
          ok: true,
          message: 'Updated hospital image.',
          hospital: updatedHospital,
        });
      } catch (err) {
        console.log(err);
        return response.status(500).json({
          ok: false,
          message: 'Error updating the hospital.',
          errors: err.toString(),
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
  if (!fileName) return;
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
