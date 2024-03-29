"use strict";

const Planete = require("../models/planete");

exports.getPlanetes = (req, res, next) => {
  /* 
      #swagger.tags = ['Planètes']
      #swagger.description = "Retourne la liste des planètes"
      #swagger.summary = "Obtenir toutes les planètes"
  */
  Planete.find()
    .then((planetes) => {
      /* #swagger.responses[200] = { 
            description: "Liste des planètes",
            schema: {
              data: [{
                "attributes": {
                  "$ref": "#/definitions/Planete"
                },
                "links": {
                  "self": "https://deeprockgalactic.danlevy.ca/planetes/625f4a9b3c6e0131874ac558",
                  "collection": "https://deeprockgalactic.danlevy.ca/planetes"
                },
                "relationships": {}
              }]
            }
        }
      */
      res.status(200).json({
        data: formated(planetes),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPlanete = (req, res, next) => {
  /* 
      #swagger.tags = ['Planètes']
      #swagger.summary = "Obtenir une planète par id"
  */
  /*
      #swagger.parameters['planeteId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  const planeteId = req.params.planeteId;

  Planete.findById(planeteId)
    .then((planete) => {
      if (planete) {
        /* #swagger.responses[200] = { 
            description: "Planete",
            schema: {
              "attributes": {
                  "$ref": "#/definitions/Planete"
                },
                "links": {
                  "self": "https://deeprockgalactic.danlevy.ca/planetes/625f4a9b3c6e0131874ac558",
                  "collection": "https://deeprockgalactic.danlevy.ca/planetes"
                },
                "relationships": {}
            }
        }
      */
        res.status(200).json(formated(planete));
      } else {
        res.status(404).json({ message: "Planète non trouvé!" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createPlanete = (req, res, next) => {
  /* 
      #swagger.tags = ['Planètes']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Créer une planète"
  */
  /*
    #swagger.parameters["body"] = {
        "in": "body",
        "name": "Planete",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Planete"
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

  const { nom, image } = req.body;

  Planete.findOne({ nom: nom }).then((planeteFound) => {
    if (planeteFound) {
      /* #swagger.responses[409] = {
            description: "Planète existante",
        }
      */
      res.status(409).json({ message: "Planète existante!" });
    } else {
      const planete = new Planete({
        nom: nom,
        image: image,
      });

      planete
        .save()
        .then(() => {
          /* #swagger.responses[201] = { 
          description: "Planète créée",
          schema: {
            message: "Planète créée avec succès!",
            data: {
              "attributes": {
                  "$ref": "#/definitions/Planete"
                },
                "links": {
                  "self": "https://deeprockgalactic.danlevy.ca/planetes/625f4a9b3c6e0131874ac558",
                  "collection": "https://deeprockgalactic.danlevy.ca/planetes"
                },
                "relationships": {}
            }
          }
        }
        */
          res.status(201).json({
            message: "Planète créée avec succès!",
            data: formated(planete),
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
};

exports.deletePlanete = (req, res, next) => {
  /* 
      #swagger.tags = ['Planètes']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Supprimer une planète"
  */
  /*
      #swagger.parameters['planeteId'] = {
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

  const planeteId = req.params.planeteId;

  Planete.findByIdAndDelete(planeteId)
    .then((planete) => {
      if (planete) {
        /* #swagger.responses[200] = { 
            description: "Planète supprimée",
            schema: {
                message: "Planète supprimée avec succès!"
            }
        }
      */
        res.status(200).json({
          message: "Planète supprimée avec succès!",
        });
      } else {
        res.status(404).json({ message: "Planète non trouvé!" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updatePlanete = (req, res, next) => {
  /* 
      #swagger.tags = ['Planètes']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Modifier une planète"
  */
  /*
      #swagger.parameters['planeteId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  /*
      #swagger.parameters["body"] = {
        "in": "body",
        "name": "Planete",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Planete"
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

  const planeteId = req.params.planeteId;
  const { nom, image } = req.body;

  Planete.findById(planeteId)
    .then((planete) => {
      if (!planete) {
        const error = new Error("Planète non trouvé!");
        error.statusCode = 404;
        throw error;
      }
      planete.nom = nom;
      planete.image = image;
      return planete.save();
    })
    .then((planete) => {
      /* #swagger.responses[200] = { 
            description: "Planète modifiée",
            schema: {
                message: "Planète modifiée avec succès!",
                data: {
                  "attributes": {
                    "$ref": "#/definitions/Planete"
                },
                "links": {
                  "self": "https://deeprockgalactic.danlevy.ca/planetes/625f4a9b3c6e0131874ac558",
                  "collection": "https://deeprockgalactic.danlevy.ca/planetes"
                },
                "relationships": {}
                }
            }
        }
      */
      res.status(200).json({
        message: "Planète modifiée avec succès!",
        data: formated(planete),
      });
    })
    .catch((err) => {
      next(err);
    });
};

function formated(obj) {
  const url = process.env.URL || "http://localhost:3000";

  const links = {
    self: `${url}/planetes/${obj._id}`,
    collection: `${url}/planetes`,
  };

  const relationships = {};

  if (obj.length > 0) {
    const objs = [];
    for (let i = 0; i < obj.length; i++) {
      objs.push(formated(obj[i]));
    }
    return objs;
  }

  return { attributes: obj, links, relationships };
}
