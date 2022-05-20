"use strict";

const Reservation = require("../models/reservation");
const Mineur = require("../models/mineur");
const Contrat = require("../models/contrat");
const jwt = require("jsonwebtoken");

exports.getReservations = (req, res, next) => {
  /* 
      #swagger.tags = ['Réservations']
      #swagger.description = "Retourne la liste des réservations"
      #swagger.summary = "Obtenir toutes les réservations"
  */

  const query = {};
  const { user, estTermine } = req.query;

  if (user) {
    const decodedToken = jwt.verify(user, process.env.SECRET_JWT);
    query.mineurId = { $in: decodedToken.userId };
  }
  if (estTermine) query.estTermine = estTermine;
  Reservation.find(query)
    .then((reservations) => {
      /* #swagger.responses[200] = { 
          description: "Liste des réservations",
          schema: {
            data: [{
              "attributes": {
                "$ref": "#/definitions/Reservation"
              },
              "links": {
                "self": "https://deeprockgalactic.danlevy.ca/reservations/628279cd8b40e062cb11b6c6",
                "collection": "https://deeprockgalactic.danlevy.ca/reservations"
              },
              "relationships": {
                "mineur": {
                    "links": {
                        "related": "https://deeprockgalactic.danlevy.ca/mineurs/62674b7e563f2f0b49f8c8ba"
                    }
                },
                "contrat": {
                    "links": {
                        "related": "https://deeprockgalactic.danlevy.ca/contrats/6265f749995a50c7205fae41"
                    }
                }
              }
            }]
          }
        }
      */
      if (reservations.length > 0)
        res.status(200).json({
          data: formated(reservations),
        });
      else res.status(404).json({ message: "Aucune réservation trouvé" });
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
              "attributes": {
                "$ref": "#/definitions/Reservation"
              },
              "links": {
                "self": "https://deeprockgalactic.danlevy.ca/reservations/628279cd8b40e062cb11b6c6",
                "collection": "https://deeprockgalactic.danlevy.ca/reservations"
              },
              "relationships": {
                "mineur": {
                    "links": {
                        "related": "https://deeprockgalactic.danlevy.ca/mineurs/62674b7e563f2f0b49f8c8ba"
                    }
                },
                "contrat": {
                    "links": {
                        "related": "https://deeprockgalactic.danlevy.ca/contrats/6265f749995a50c7205fae41"
                    }
                }
              }
            }
        }
      */
        res.status(200).json(formated(reservation));
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
  /* #swagger.security = [{
    "bearerAuth": []
  }] */

  const { contratId } = req.params;

  const mineurId = req.params.mineurId ? req.params.mineurId : req.user.userId;

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
                            data: {
                              "attributes": {
                                "$ref": "#/definitions/Reservation"
                              },
                              "links": {
                                "self": "https://deeprockgalactic.danlevy.ca/reservations/628279cd8b40e062cb11b6c6",
                                "collection": "https://deeprockgalactic.danlevy.ca/reservations"
                              },
                              "relationships": {
                                "mineur": {
                                    "links": {
                                        "related": "https://deeprockgalactic.danlevy.ca/mineurs/62674b7e563f2f0b49f8c8ba"
                                    }
                                },
                                "contrat": {
                                    "links": {
                                        "related": "https://deeprockgalactic.danlevy.ca/contrats/6265f749995a50c7205fae41"
                                    }
                                }
                              }
                            }
                        }
                    }*/
                    res.status(201).json({
                      message: "Réservation créée avec succès!",
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
  /* #swagger.security = [{
    "bearerAuth": []
  }] */

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
  /* #swagger.security = [{
    "bearerAuth": []
  }] */

  if (req.user.niveau !== 2) {
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas effectuer cette action." });
  }

  const reservationId = req.params.reservationId;
  const { mineurId, contratId, estTermine } = req.body;

  Mineur.findById(mineurId).then((mineur) => {
    if (!mineur) {
      /* #swagger.responses[404] = { 
            description: "Mineur non trouvé.",
            }
          }
      */
      return res.status(404).json({ message: "Mineur non trouvé" });
    } else {
      Contrat.findById(contratId).then((contrat) => {
        if (!contrat) {
          /* #swagger.responses[404] = { 
                description: "Contrat non trouvé",
                }
              }
          */
          return res.status(404).json({ message: "Contrat non trouvé" });
        } else {
          Reservation.findById(reservationId)
            .then((reservation) => {
              if (!reservation) {
                /* #swagger.responses[404] = { 
                      description: "Réservation non trouvé.",
                      }
                    }
                */
                res.status(404).json({ message: "Réservation non trouvé." });
              } else {
                reservation.mineurId = mineurId;
                reservation.contratId = contratId;
                reservation.estTermine = estTermine;
                return reservation.save();
              }
            })
            .then((reservation) => {
              /* #swagger.responses[200] = { 
                    description: "Réservation modifiée",
                    schema: {
                        message: "Réservation modifiée avec succès!",
                        data: {
                          "attributes": {
                            "$ref": "#/definitions/Reservation"
                          },
                          "links": {
                            "self": "https://deeprockgalactic.danlevy.ca/reservations/628279cd8b40e062cb11b6c6",
                            "collection": "https://deeprockgalactic.danlevy.ca/reservations"
                          },
                          "relationships": {
                            "mineur": {
                                "links": {
                                    "related": "https://deeprockgalactic.danlevy.ca/mineurs/62674b7e563f2f0b49f8c8ba"
                                }
                            },
                            "contrat": {
                                "links": {
                                    "related": "https://deeprockgalactic.danlevy.ca/contrats/6265f749995a50c7205fae41"
                                }
                            }
                          }
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
        }
      });
    }
  });
};

function formated(obj) {
  const url = process.env.URL || "http://localhost:3000";

  const links = {
    self: `${url}/reservations/${obj._id}`,
    collection: `${url}/reservations`,
  };

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
    const objs = [];
    for (let i = 0; i < obj.length; i++) {
      objs.push(formated(obj[i]));
    }
    return objs;
  }

  return { attributes: obj, links, relationships };
}
