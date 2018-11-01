// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Medico = require('../models/medico');

// ================================================
// Obtener todos los Médicos
// ================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Médicos.',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            });
});

// ================================================
// Crear un médico
// ================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuario._id
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando Médico.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioLogueado: req.usuario
        });
    });

});

// ================================================
// Actualizar un médico dado su ID
// ================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medicoEncontrado) => {
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
                mensaje: 'El Médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe un médico con ese ID.' }
            });
        }
        medicoEncontrado.nombre = body.nombre;
        medicoEncontrado.hospital = body.hospital;
        medicoEncontrado.usuario = req.usuario._id;
        medicoEncontrado.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Médico.',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });

});

// ================================================
// Borrar un médico dado su ID
// ================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findByIdAndDelete(id, (err, medicoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Médico.',
                errors: err
            });
        }
        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe un médico con ese ID.' }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });
    });

});

module.exports = app;