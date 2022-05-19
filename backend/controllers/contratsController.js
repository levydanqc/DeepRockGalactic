"use strict";

const { format } = require("prettier");
const Contrat = require("../models/contrat");

exports.getContrats = (req, res, next) => {
  /* 
      #swagger.tags = ['Contrats']
      #swagger.description = "Retourne la liste des contrats"
      #swagger.summary = "Obtenir tous les contrats"
  */
  Contrat.find()
    .then((contrats) => {
      /* #swagger.responses[200] = { 
          description: "Liste des contrats",
          schema: [{
            "attributes": {
              "$ref": "#/definitions/Contrat"
            },
            "links": {
              "self": "https://deeprockgalactic.danlevy.ca/contrats/6265f745995a50c7205fae3d",
              "collection": "https://deeprockgalactic.danlevy.ca/contrats",
              "reserve": "https://deeprockgalactic.danlevy.ca/reservations/6265f745995a50c7205fae3d"
            },
            "relationships": {
              "planete": {
                  "links": {
                    "related": "https://deeprockgalactic.danlevy.ca/planetes/6265f73f995a50c7205fae3b"
                  }
              }
            }
          }]
        }
      */
      res.status(200).json({
        data: this.formated(contrats),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getContrat = (req, res, next) => {
  /* 
      #swagger.tags = ['Contrats']
      #swagger.summary = "Obtenir un contrat par id"
  */
  /*
      #swagger.parameters['contratId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  const id = req.params.contratId;

  Contrat.findById(id)
    .then((contrat) => {
      if (contrat) {
        /* #swagger.responses[200] = { 
            description: "Contrat",
            schema: {
              "attributes": {
                "$ref": "#/definitions/Contrat"
              },
              "links": {
                "self": "https://deeprockgalactic.danlevy.ca/contrats/6265f745995a50c7205fae3d",
                "collection": "https://deeprockgalactic.danlevy.ca/contrats",
                "reserve": "https://deeprockgalactic.danlevy.ca/reservations/6265f745995a50c7205fae3d"
              },
              "relationships": {
                "planete": {
                    "links": {
                      "related": "https://deeprockgalactic.danlevy.ca/planetes/6265f73f995a50c7205fae3b"
                    }
                }
              }
            }
        }
      */
        res.json(this.formated(contrat));
      } else {
        res.status(404).json({ message: "Contrat non trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createContrat = (req, res, next) => {
  /* 
      #swagger.tags = ['Contrats']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Créer un contrat"
  */
  /*
    #swagger.parameters["body"] = {
        "in": "body",
        "name": "Contrat",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Contrat"
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

  const {
    planeteId,
    prime,
    danger,
    ressource,
    quantiteRessource,
    dateExpiration,
  } = req.body;

  Contrat.findOne({
    planeteId: planeteId,
    ressource: ressource,
    dateExpiration: dateExpiration,
    danger: danger,
    quantiteRessource: quantiteRessource,
    prime: prime,
  })
    .then((contrat) => {
      if (contrat) {
        /* #swagger.responses[409] = {
            description: "Contrat existant",
        }
        */
        res.status(409).json({ message: "Contrat existant" });
      } else {
        const contrat = new Contrat({
          planeteId: planeteId,
          prime: prime,
          danger: danger,
          ressource: ressource,
          quantiteRessource: quantiteRessource,
          dateExpiration: dateExpiration,
        });

        contrat
          .save()
          .then(() => {
            /* #swagger.responses[201] = { 
              description: "Contrat créé",
              schema: {
                message: "Contrat créé avec succès!",
                data: {
                  "attributes": {
                    "$ref": "#/definitions/Contrat"
                  },
                  "links": {
                    "self": "https://deeprockgalactic.danlevy.ca/contrats/6283e8a0c877f1f7d11423d1",
                    "collection": "https://deeprockgalactic.danlevy.ca/contrats",
                    "reserve": "https://deeprockgalactic.danlevy.ca/reservations/6283e8a0c877f1f7d11423d1",
                  },
                  "relationships": {
                    "planete": {
                      "links": {
                        "related": "https://deeprockgalactic.danlevy.ca/planetes/6283da4158b47d87db5f485b"
                      }
                    }
                  },
                },
              },
            }
            */
            res.status(201).json({
              message: "Contrat créé avec succès!",
              data: this.formated(contrat),
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
};

exports.deleteContrat = (req, res, next) => {
  /* 
      #swagger.tags = ['Contrats']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Supprimer un contrat"
  */
  /*
      #swagger.parameters['contratId'] = {
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

  const contratId = req.params.contratId;

  Contrat.findByIdAndDelete(contratId)
    .then((contrat) => {
      if (contrat) {
        /* #swagger.responses[200] = { 
            description: "Contrat supprimé",
            schema: {
                message: "Contrat supprimé avec succès!"
            }
        }
      */
        res.status(200).json({
          message: "Contrat supprimé avec succès!",
        });
      } else {
        res.status(404).json({ message: "Contrat non trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateContrat = (req, res, next) => {
  /* 
      #swagger.tags = ['Contrats']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Modifier un contrat"
  */
  /*
      #swagger.parameters['contratId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  /*
      #swagger.parameters["body"] = {
        "in": "body",
        "name": "Contrat",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Contrat"
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

  const contratId = req.params.contratId;
  const {
    planeteId,
    prime,
    danger,
    ressource,
    quantiteRessource,
    dateExpiration,
  } = req.body;

  Contrat.findById(contratId)
    .then((contrat) => {
      if (!contrat) {
        const error = new Error("Contrat non trouvé");
        error.statusCode = 404;
        throw error;
      }
      contrat.planeteId = planeteId;
      contrat.prime = prime;
      contrat.danger = danger;
      contrat.ressource = ressource;
      contrat.quantiteRessource = quantiteRessource;
      contrat.dateExpiration = dateExpiration;

      return contrat.save();
    })
    .then((contrat) => {
      /* #swagger.responses[200] = { 
            description: "Contrat modifié",
            schema: {
              message: "Contrat modifié avec succès!",
              data: {
                "attributes": {
                  "$ref": "#/definitions/Contrat"
                },
                "links": {
                    "self": "https://deeprockgalactic.danlevy.ca/contrats/6283e8a0c877f1f7d11423d1",
                    "collection": "https://deeprockgalactic.danlevy.ca/contrats",
                    "reserve": "https://deeprockgalactic.danlevy.ca/reservations/6283e8a0c877f1f7d11423d1"
                },
                "relationships": {
                    "planete": {
                        "links": {
                            "related": "https://deeprockgalactic.danlevy.ca/planetes/6283da4158b47d87db5f485b"
                        }
                    }
                }
              }
            }
        }
      */
      res.status(200).json({
        message: "Contrat modifié avec succès!",
        data: this.formated(contrat),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.formated = (obj) => {
  const url = process.env.URL || "http://localhost:3000";

  const links = {
    self: `${url}/contrats/${obj._id}`,
    collection: `${url}/contrats`,
    reserve: `${url}/reservations/${obj._id}`,
  };

  const relationships = {
    planete: {
      links: {
        related: `${url}/planetes/${obj.planeteId}`,
      },
    },
  };

  if (obj.length > 0) {
    const objs = [];
    for (let i = 0; i < obj.length; i++) {
      objs.push(this.formated(obj[i]));
    }
    return objs;
  }

  return { attributes: obj, links, relationships };
};
