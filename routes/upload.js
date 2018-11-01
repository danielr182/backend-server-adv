// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

// ================================================
// Cargar archivos
// ================================================

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var idTipo = req.params.id;

    // Tipos de colección
    var tiposValidos = ['medicos', 'usuarios', 'hospitales'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección inválida.',
            errors: { message: 'Los tipos de colección válidos son ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó alguna imagen.',
            errors: { message: 'Debe seleccionar una imagen.' }
        });
    }
    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreArchivoSeparado = archivo.name.split('.');
    var extensionArchivo = nombreArchivoSeparado[nombreArchivoSeparado.length - 1];

    // Validación extensión archivo
    var extensionesValidas = ['png', 'jpeg', 'jpg', 'gif'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión de archivo no válida.',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nuevoNombreArchivo = `${ idTipo }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo a un path del server
    var path = `./uploads/${ tipo }/${ nuevoNombreArchivo }`;
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo.',
                errors: err
            });
        }
    });

    subirPorTipo(tipo, idTipo, nuevoNombreArchivo, res);

});

function subirPorTipo(tipo, idTipo, nombreArchivo, res) {

    switch (tipo) {
        case 'usuarios':
            Usuario.findById(idTipo, (err, usuarioEncontrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar Usuario.',
                        errors: err
                    });
                }
                if (!usuarioEncontrado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El Usuario con el id ' + idTipo + ' no existe.',
                        errors: { message: 'No existe un usuario con ese ID.' }
                    });
                }
                var pathAnterior = './uploads/usuarios/' + usuarioEncontrado.img;
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathAnterior)) {
                    fs.unlink(pathAnterior, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al eliminar la imagen anterior del usuario.',
                                errors: err
                            });
                        }
                    });
                }
                usuarioEncontrado.img = nombreArchivo;
                return usuarioEncontrado.save((err, usuarioActualizado) => {
                    usuarioActualizado.password = 'none';
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada.',
                        usuario: usuarioActualizado
                    });
                })
            });
            break;
        case 'medicos':
            Medico.findById(idTipo, (err, medicoEncontrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar Médico.',
                        errors: err
                    });
                }
                if (!medicoEncontrado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El Médico con el id ' + idTipo + ' no existe.',
                        errors: { message: 'No existe un médico con ese ID.' }
                    });
                }
                var pathAnterior = './uploads/medicos/' + medicoEncontrado.img;
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathAnterior)) {
                    fs.unlink(pathAnterior, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al eliminar la imagen anterior del médico.',
                                errors: err
                            });
                        }
                    });
                }
                medicoEncontrado.img = nombreArchivo;
                return medicoEncontrado.save((err, medicoActualizado) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de médico actualizada.',
                        medico: medicoActualizado
                    });
                })
            });
            break;
        case 'hospitales':
            Hospital.findById(idTipo, (err, hospitalEncontrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar Médico.',
                        errors: err
                    });
                }
                if (!hospitalEncontrado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El Hospital con el id ' + idTipo + ' no existe.',
                        errors: { message: 'No existe un hospital con ese ID.' }
                    });
                }
                var pathAnterior = './uploads/hospitales/' + hospitalEncontrado.img;
                // Si existe, elimina la imagen anterior
                if (fs.existsSync(pathAnterior)) {
                    fs.unlink(pathAnterior, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al eliminar la imagen anterior del hospital.',
                                errors: err
                            });
                        }
                    });
                }
                hospitalEncontrado.img = nombreArchivo;
                return hospitalEncontrado.save((err, hospitalActualizado) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada.',
                        hospital: hospitalActualizado
                    });
                })
            });
            break;

        default:
            break;
    }

}

module.exports = app;

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));