"use strict";

const Contrat = require("../models/contrat");

exports.getContrats = (req, res, next) => {
  Contrat.find()
    .then((contrats) => {
      res.status(200).json({
        contrats: contrats,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getContrat = (req, res, next) => {
  const id = req.params.id;

  Contrat.findById(id)
    .then((contrat) => {
      if (contrat) {
        res.status(200).json(contrat);
      } else {
        res.status(404).json({ message: "Le contrat n'existe pas!" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createContrat = (req, res, next) => {
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
      res.status(201).json({
        message: "Contrat créé",
        contrat: contrat,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteContrat = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas supprimer de contrat");
    error.statusCode = 401;
    throw error;
  }

  const contratId = req.params.contratId;

  Contrat.findByIdAndDelete(contratId)
    .then((contrat) => {
      if (contrat) {
        res.status(200).json({
          message: "Contrat supprimé avec succès!",
        });
      } else {
        res.status(404).json({ message: "Le contrat n'existe pas!" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateContrat = (req, res, next) => {
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
        const error = new Error("Le contrat n'existe pas!");
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
      res.status(200).json({
        message: "Contrat modifié",
        contrat: contrat,
      });
    })
    .catch((err) => {
      next(err);
    });
};
