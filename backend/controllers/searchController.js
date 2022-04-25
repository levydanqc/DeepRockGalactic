"use strict";

const Contrat = require("../models/contrat");

exports.createSearch = (req, res, next) => {
  /* 
        #swagger.tags = ['Recherche']
        #swagger.summary = "Effectuer une recherche"
  */
  /*  #swagger.parameters['dangers'] = {
            in: 'query',
            description: 'Niveaux de dangers recherchés, séparés par des virgules',
  } */
  /*  #swagger.parameters['planetesId'] = {
            in: 'query',
            description: 'Niveaux de dangers recherchés, séparés par des virgules',
  } */

  const { minDate, maxDate, minPrime, maxPrime, dangers, planetsId } =
    req.query;
  const query = {};

  if (minDate) {
    query.dateExpiration = { $gte: new Date(minDate) };
  }
  if (maxDate) {
    query.dateExpiration = { $lte: new Date(maxDate) };
  }
  if (minPrime) {
    query.prime = { $gte: minPrime };
  }
  if (maxPrime) {
    query.prime = { $lte: maxPrime };
  }
  if (dangers) {
    query.danger = { $in: dangers.split(",") };
  }
  if (planetsId) {
    query.planeteId = { $in: planetsId.split(",") };
  }

  Contrat.find(query)
    .populate("planeteId")
    .exec(function (err, contrats) {
      if (err) return handleError(err);
      if (contrats) {
        /* #swagger.responses[200] = { 
            description: "Liste des contrats",
            schema: [{
                "$ref": "#/definitions/Contrat",
            }]
        }
      */
        res.status(200).json(contrats);
      } else {
        res.status(404).json({ message: "Aucun contrat trouvé" });
      }
    });
};
