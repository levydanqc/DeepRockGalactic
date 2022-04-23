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
  const reservationId = req.params.reservationId;

  Reservation.findById(reservationId)
    .then((reservation) => {
      if (reservation) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ message: "La réservation n'existe pas" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createReservation = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas créer de réservation");
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
        message: "Réservation créée",
        reservation: reservation,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteReservation = (req, res, next) => {
  const reservationId = req.params.reservationId;

  Reservation.findByIdAndDelete(reservationId)
    .then((reservation) => {
      if (reservation) {
        res.status(200).json({
          message: "Réservation supprimée avec succès!",
        });
      } else {
        res.status(404).json({ message: "La réservation n'existe pas" });
      }
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

  const reservationId = req.params.reservationId;
  const { mineurId, contratId, estTermine } = req.body;

  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("La réservation n'existe pas.");
        error.statusCode = 404;
        throw error;
      }
      reservation.mineurId = mineurId;
      reservation.contratId = contratId;
      reservation.estTermine = estTermine;
      return reservation.save();
    })
    .then((reservation) => {
      res.status(200).json({
        message: "Réservation modifiée avec succès!",
        reservation: reservation,
      });
    })
    .catch((err) => {
      next(err);
    });
};
