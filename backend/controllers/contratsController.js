"use strict";

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
        contrats: contrats,
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
  const id = req.params.id;

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
        res.status(200).json(contrat);
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
    const error = new Error("Vous ne pouvez pas créer de contrat");
    error.statusCode = 401;
    throw error;
  }

  const {
    planeteId,
    prime,
    danger,
    ressource,
    quantiteRessource,
    dateExpiration,
  } = req.body;

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
        contrat: contrat,
      });
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
    const error = new Error("Vous ne pouvez pas supprimer de contrat");
    error.statusCode = 401;
    throw error;
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
    const error = new Error("Vous ne pouvez pas modifier de contrat");
    error.statusCode = 401;
    throw error;
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
        contrat: contrat,
      });
    })
    .catch((err) => {
      next(err);
    });
};
