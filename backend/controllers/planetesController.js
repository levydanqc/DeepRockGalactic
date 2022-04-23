"use strict";

const Planete = require("../models/planete");

exports.getPlanetes = (req, res, next) => {
  Planete.find()
    .then((planetes) => {
      res.json({
        planetes: planetes,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPlanete = (req, res, next) => {
  const planeteId = req.params.planeteId;

  Planete.findById(planeteId)
    .then((planete) => {
      if (!planete) {
        const error = new Error("La planète n'existe pas.");
        error.statusCode = 404;
        throw error;
      }
      res.json({
        planete: planete,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createPlanete = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas créer de planète");
    error.statusCode = 401;
    throw error;
  }

  const { nom, image } = req.body;

  const planete = new Planete({
    nom: nom,
    image: image,
  });

  planete
    .save()
    .then(() => {
      res.status(201).json({
        message: "Planete créée",
        planete: planete,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deletePlanete = (req, res) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas supprimer de planète");
    error.statusCode = 401;
    throw error;
  }

  const planeteId = req.params.planeteId;

  Planete.findByIdAndDelete(planeteId)
    .then((planete) => {
      if (planete) {
        res.status(200).json({
          message: "Planète supprimée avec succès!",
        });
      } else {
        res.status(404).json({ message: "La planète n'existe pas!" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updatePlanete = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas modifier de planète");
    error.statusCode = 401;
    throw error;
  }

  const planeteId = req.params.planeteId;
  const { nom, image } = req.body;

  Planete.findById(planeteId)
    .then((planete) => {
      if (!planete) {
        const error = new Error("La planète n'existe pas!");
        error.statusCode = 404;
        throw error;
      }
      planete.nom = nom;
      planete.image = image;
      return planete.save();
    })
    .then((planete) => {
      res.status(200).json({
        message: "Planète modifiée",
        planete: planete,
      });
    })
    .catch((err) => {
      next(err);
    });
};
