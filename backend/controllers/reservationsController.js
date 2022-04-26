"use strict";

const Reservation = require("../models/reservation");

exports.getReservations = (req, res, next) => {
  /* 
      #swagger.tags = ['Réservations']
      #swagger.description = "Retourne la liste des réservations"
      #swagger.summary = "Obtenir toutes les réservations"
  */
  Reservation.find()
    .then((reservations) => {
      /* #swagger.responses[200] = { 
            description: "Liste des réservations",
            schema: [{
                "$ref": "#/definitions/Reservation"
            }]
        }
      */
      res.status(200).json({
        reservations,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReservation = (req, res, next) => {
  /* 
      #swagger.tags = ['Réservations']
      #swagger.summary = "Obtenir une réservation par id"
  */
  /*
      #swagger.parameters['reservationId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  const reservationId = req.params.reservationId;

  Reservation.findById(reservationId)
    .then((reservation) => {
      if (reservation) {
        /* #swagger.responses[200] = { 
            description: "Reservation",
            schema: {
                "$ref": "#/definitions/Reservation"
            }
        }
      */
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ message: "Réservation non trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createReservation = (req, res, next) => {
  /* 
      #swagger.tags = ['Réservations']
      #swagger.summary = "Créer une réservation"
  */
  /*
    #swagger.parameters["body"] = {
        "in": "body",
        "name": "Reservation",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Reservation"
        }
    }
  */
  const { mineurId, contratId } = req.params;

  Reservation.findOne({ mineurId, contratId }).then((reservation) => {
    if (reservation) {
      /* #swagger.responses[409] = { 
            description: "Réservation existante",
            }
          }
      */
      res.status(409).json({ message: "Réservation existante" });
    } else {
      const { estTermine } = req.body;

      const reservation = new Reservation({
        mineurId: mineurId,
        contratId: contratId,
        estTermine: estTermine,
      });

      reservation
        .save()
        .then(() => {
          /* #swagger.responses[201] = { 
              description: "Réservation créée",
              schema: {
                  message: "Réservation créée avec succès!",
                  reservation: {
                      "$ref": "#/definitions/Reservation"
                  }
              }
          }*/
          res.status(201).json({
            message: "Réservation créée",
            reservation: reservation,
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
};

exports.deleteReservation = (req, res, next) => {
  /* 
      #swagger.tags = ['Réservations']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Supprimer une réservation"
  */
  /*
      #swagger.parameters['reservationId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  if (req.user.niveau !== 2) {
    res
      .status(401)
      .json({ message: "Vous ne pouvez pas créer de réservation" });
  }

  const reservationId = req.params.reservationId;

  Reservation.findByIdAndDelete(reservationId)
    .then((reservation) => {
      if (reservation) {
        /* #swagger.responses[200] = { 
            description: "Réservation supprimée",
            schema: {
                message: "Réservation supprimée avec succès!"
            }
        }
      */
        res.status(200).json({
          message: "Réservation supprimée avec succès!",
        });
      } else {
        res.status(404).json({ message: "Réservation non trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReservation = (req, res, next) => {
  /* 
      #swagger.tags = ['Réservations']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Modifier une réservation"
  */
  /*
      #swagger.parameters['reservationId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  /*
      #swagger.parameters["body"] = {
        "in": "body",
        "name": "Reservation",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Reservation"
        }
    }
  */
  if (req.user.niveau !== 2) {
    res
      .status(401)
      .json({ message: "Vous ne pouvez pas créer de réservation" });
  }

  const reservationId = req.params.reservationId;
  const { mineurId, contratId, estTermine } = req.body;

  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("Réservation non trouvé.");
        error.statusCode = 404;
        throw error;
      }
      reservation.mineurId = mineurId;
      reservation.contratId = contratId;
      reservation.estTermine = estTermine;
      return reservation.save();
    })
    .then((reservation) => {
      /* #swagger.responses[200] = { 
            description: "Réservation modifiée",
            schema: {
                message: "Réservation modifiée avec succès!",
                réservation: {
                    "$ref": "#/definitions/Reservation"
                }
            }
        }
      */
      res.status(200).json({
        message: "Réservation modifiée avec succès!",
        reservation: reservation,
      });
    })
    .catch((err) => {
      next(err);
    });
};
