"use strict";

const Reservation = require("../models/reservation");
const Mineur = require("../models/mineur");
const Contrat = require("../models/contrat");

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
        data: formated(reservations),
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
        res.status(200).json({ data: formated(reservation) });
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

  Mineur.findById(mineurId).then((mineur) => {
    if (!mineur) {
      return res.status(404).json({ message: "Mineur non trouvé" });
    } else {
      Contrat.findById(contratId).then((contrat) => {
        if (!contrat) {
          return res.status(404).json({ message: "Contrat non trouvé" });
        } else {
          Reservation.findOne({ mineurId, contratId })
            .then((reservation) => {
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
                      data: formated(reservation),
                    });
                  })
                  .catch((err) => {
                    next(err);
                  });
              }
            })
            .catch((err) => {
              next(err);
            });
        }
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
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas effectuer cette action." });
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
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas effectuer cette action." });
  }

  const reservationId = req.params.reservationId;
  const { mineurId, contratId, estTermine } = req.body;

  Mineur.findById(mineurId).then((mineur) => {
    if (!mineur) {
      return res.status(404).json({ message: "Mineur non trouvé" });
    }
  });
  Contrat.findById(contratId).then((contrat) => {
    if (!contrat) {
      return res.status(404).json({ message: "Contrat non trouvé" });
    }
  });

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
        data: formated(reservation),
      });
    })
    .catch((err) => {
      next(err);
    });
};

function formated(obj) {
  const url = process.env.URL || "http://localhost:3000";

  const links = [
    {
      rel: "self",
      method: "GET",
      href: `${url}/reservations/${obj._id}`,
    },
    {
      rel: "create",
      method: "POST",
      href: `${url}/reservations/`,
    },
    {
      rel: "update",
      method: "PUT",
      href: `${url}/reservations/${obj._id}`,
    },
    {
      rel: "delete",
      method: "DELETE",
      href: `${url}/reservations/${obj._id}`,
    },
  ];
  const relationships = {
    mineur: {
      links: {
        related: `${url}/mineurs/${obj.mineurId}`,
      },
    },
    contrat: {
      links: {
        related: `${url}/contrats/${obj.contratId}`,
      },
    },
  };

  if (obj.length > 0) {
    const obj = [];
    for (let i = 0; i < obj.length; i++) {
      obj.push(formated(obj[i]));
    }
    return obj;
  }

  return { attributes: obj, links, relationships };
}
