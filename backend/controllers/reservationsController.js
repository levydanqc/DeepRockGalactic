"use strict";

const Reservation = require("../models/reservation");

exports.getReservations = (req, res, next) => {
  Reservation.find()
    .then((reservations) => {
      res.status(200).json({
        reservations: reservations,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReservation = (req, res, next) => {
  const id = req.params.id;

  Reservation.findById(id)
    .then((reservation) => {
      if (reservation) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ message: "La reservation n'existe pas!" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createReservation = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas créer de planète");
    error.statusCode = 401;
    throw error;
  }

  const { mineurId, contratId, estTermine } = req.body;

  const reservation = new Reservation({
    mineurId: mineurId,
    contratId: contratId,
    estTermine: estTermine,
  });

  reservation
    .save()
    .then(() => {
      res.status(201).json({
        message: "Planète créée",
        reservation: reservation,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteReservation = (req, res, next) => {
  const planeteId = req.params.id;

  Reservation.findByIdAndRemove(planeteId)
    .then(() => {
      res.status(200).json({
        message: "Planète supprimée",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReservation = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas modifier de planète");
    error.statusCode = 401;
    throw error;
  }

  const planeteId = req.params.planeteId;
  const { mineurId, contratId, estTermine } = req.body;

  Reservation.findById(planeteId)
    .then((planete) => {
      if (!planete) {
        const error = new Error("La planète n'existe pas.");
        error.statusCode = 404;
        throw error;
      }
      planete.mineurId = mineurId;
      planete.contratId = contratId;
      planete.estTermine = estTermine;
      return planete.save();
    })
    .then((planete) => {
      res.status(200).json({
        message: "Planète modifiée",
        planete: planete,
      });
    })
    .catch((err) => {
      next(err);
    });
};
