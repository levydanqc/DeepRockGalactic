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
                "$ref": "#/definitions/Contrat"
            }]
        }
      */
      res.status(200).json({
        data: formated(contrats),
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
                "$ref": "#/definitions/Contrat"
            }
        }
      */
        res.json(formated(contrat));
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
                  contrat: {
                      "$ref": "#/definitions/Contrat"
                  }
              }
          }
        */
            res.status(201).json({
              message: "Contrat créé avec succès!",
              data: formated(contrat),
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
                contrat: {
                    "$ref": "#/definitions/Contrat"
                }
            }
        }
      */
      res.status(200).json({
        message: "Contrat modifié avec succès!",
        contrat: formated(contrat),
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
      href: `${url}/contrats/${obj._id}`,
    },
    {
      rel: "create",
      method: "POST",
      href: `${url}/contrats/`,
    },
    {
      rel: "update",
      method: "PUT",
      href: `${url}/contrats/${obj._id}`,
    },
    {
      rel: "delete",
      method: "DELETE",
      href: `${url}/contrats/${obj._id}`,
    },
    {
      rel: "reserve",
      method: "POST",
      href: `${url}/reservations/${obj._id}`,
    },
  ];
  const relationships = {
    planete: {
      links: {
        related: `${url}/planetes/${obj.planeteId}`,
      },
    },
  };

  if (obj.length > 0) {
    const contrats = [];
    for (let i = 0; i < obj.length; i++) {
      contrats.push(formated(obj[i]));
    }
    return contrats;
  }

  return { attributes: obj, links, relationships };
}
