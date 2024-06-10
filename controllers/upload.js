const { v4: uuidv4 } = require('uuid');
const { uploadByType } = require('../helpers/upload-image');

const uploadFile = (req, res) => {
  const type = req.params.type;
  const idType = req.params.id;

  // Collection types
  const validTypes = ['medics', 'users', 'hospitals'];

  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid collection type.',
      errors: { message: 'Valid collection types are ' + validTypes.join(', ') },
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'You did not select any image.',
      errors: { message: 'You need to select an image.' },
    });
  }
  if (req.files.image.length > 1) {
    return res.status(400).json({
      ok: false,
      message: 'select only one image.',
      errors: { message: 'You need to select only one image.' },
    });
  }

  // Get the file name
  const file = req.files.image;
  const splitFileName = file.name.split('.');
  const fileExtension = splitFileName[splitFileName.length - 1].toLowerCase();

  // Validation Extension File
  const validExtensions = ['png', 'jpeg', 'jpg', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid file extension.',
      errors: { message: 'Valid extensions are ' + validExtensions.join(', ') },
    });
  }

  // Custom file name
  const newFileName = `${uuidv4()}.${fileExtension}`;

  uploadByType({ file, type, idType, newFileName, res });
};

module.exports = { uploadFile };
