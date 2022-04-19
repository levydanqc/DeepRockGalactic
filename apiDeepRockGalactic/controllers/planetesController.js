"use strict";

const Planete = require('../models/planete');

exports.getPlanetes = (req, res, next) => {
  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }

  Planete.find()
    .then(planetes => {
      res.json({
        planetes: planetes
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.getPlanete = (req, res, next) => {
  const PlaneteId = req.params.PlaneteId;

  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }

  Planete.findById(PlaneteId)
    .then(planete => {
      if (!planete) {
        const error = new Error('Le planete n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      res.json({
        planete: planete
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.createPlanete = (req, res, next) => {
  const {
    nom,
    image
  } = req.body;

  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }

  const planete = new Planete({
    nom: nom,
    image: image
  });

  planete.save()
    .then(() => {
      res.status(200).json({
        message: "Planete créée",
        planete: planete
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.deletePlanete = (req, res, next) => {
  console.log(req.user);
  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas supprimer");
    error.statusCode = 401;
    throw error;
  }
  const planeteId = req.params.planeteId;
  Planete.findByIdAndRemove(planeteId)
    .then(() => {
      console.log('Planete supprimée');
      res.status(200).json({
        message: "Planete supprimée"
      });
    });

};

exports.updatePlanete = (req, res, next) => {
  const planeteId = req.params.planeteId;
  const {nom,image} = req.body;

  if (req.user.level !== 2) {
    const error = new Error("Vous ne pouvez pas...");
    error.statusCode = 401;
    throw error;
  }

  Planete.findById(planeteId)
    .then(planete => {
      if (!planete) {
        const error = new Error('Le planete n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      planete.nom = nom;
      planete.image = image;
      return planete.save();
    })
    .then(planete => {
      res.status(200).json({
        message: "Planete modifiée",
        planete: planete
      });
    })
    .catch(err => {
      next(err);
    });
};