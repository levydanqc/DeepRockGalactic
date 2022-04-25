"use strict";

const Contrat = require("../models/contrat");

exports.createSearch = (req, res, next) => {
  /* 
        #swagger.tags = ['Recherche']
        #swagger.summary = "Effectuer une recherche"
  */

  const { minDate, maxDate, minPrime, maxPrime, dangers, planetId } = req.query;
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
  if (planetId) {
    query.planeteId = planetId;
  }

  Contrat.find(query)
    .populate("planeteId")
    .exec(function (err, contrats) {
      if (err) return handleError(err);
      if (contrats) {
        res.status(200).json(contrats);
      } else {
        res.status(404).json({ message: "Aucun contrat trouvé" });
      }
    });
};
