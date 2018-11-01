// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Hospital = require('../models/hospital');

// ================================================
// Obtener todos los Hospitales
// ================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Hospitales.',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
            });
});

// ================================================
// Crear un hopital
// ================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando Hospital.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioLogueado: req.usuario
        });
    });

});

// ================================================
// Actualizar un hospital dado su ID
// ================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospitalEncontrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital.',
                errors: err
            });
        }
        if (!hospitalEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con el id ' + id + ' no existe.',
                errors: { message: 'No existe un hospital con ese ID.' }
            });
        }
        hospitalEncontrado.nombre = body.nombre;
        hospitalEncontrado.usuario = req.usuario._id;
        hospitalEncontrado.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Hospital.',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });

});

// ================================================
// Borrar un hospital dado su ID
// ================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Hospital.',
                errors: err
            });
        }
        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con el id ' + id + ' no existe.',
                errors: { message: 'No existe un hospital con ese ID.' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });
    });

});

module.exports = app;