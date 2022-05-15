"use strict";

const Contrat = require("../models/contrat");
const Planete = require("../models/planete");
const { formated } = require("../controllers/contratsController");

exports.createSearch = async (req, res, next) => {
  /* 
        #swagger.tags = ['Recherche']
        #swagger.summary = "Effectuer une recherche"
  */
  /*  #swagger.parameters['dangers'] = {
            in: 'query',
            description: 'Niveaux de dangers recherchés, séparés par des virgules',
  } */
  /*  #swagger.parameters['planetIds'] = {
            in: 'query',
            description: 'Id des planètes recherchées, séparés par des virgules',
  } */

  const { minDate, maxDate, minPrime, maxPrime, dangers, planets } = req.query;
  const query = {};

  if (minDate) {
    query.dateExpiration
      ? (query.dateExpiration.$gte = new Date(minDate))
      : (query.dateExpiration = { $gte: new Date(minDate) });
  }
  if (maxDate) {
    query.dateExpiration
      ? (query.dateExpiration.$lte = new Date(maxDate))
      : (query.dateExpiration = { $lte: new Date(maxDate) });
  }
  if (minPrime) {
    query.prime
      ? (query.prime.$gte = minPrime)
      : (query.prime = { $gte: minPrime });
  }
  if (maxPrime) {
    query.prime
      ? (query.prime.$lte = maxPrime)
      : (query.prime = { $lte: maxPrime });
  }
  if (dangers) {
    query.danger = { $in: dangers.split(",") };
  }
  if (planets) {
    await Planete.find({ nom: { $in: planets.split(",") } }).then((planets) => {
      const planetIds = planets.map((planete) => planete._id);
      query.planeteId = { $in: planetIds };
    });
  }

  Contrat.find(query).then((contrats) => {
    if (contrats.length > 0) {
      console.log("search");
      /* #swagger.responses[200] = { 
            description: "Liste des contrats",
            schema: [{
                "$ref": "#/definitions/Contrat",
            }]
        }
      */
      res.status(200).json({ data: formated(contrats) });
    } else {
      res.status(404).json({ message: "Aucun contrat trouvé" });
    }
  });
};
