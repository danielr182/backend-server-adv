const path = require('path');
const fs = require('fs');

const getImage = (req, res) => {
  const type = req.params.type;
  const img = req.params.img;

  const pathImagen = path.resolve(__dirname, `../uploads/${type}/${img}`);

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    const pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(pathNoImg);
  }
};

module.exports = { getImage };
