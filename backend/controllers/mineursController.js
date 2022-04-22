"use strict";

const Mineur = require("../models/mineur");

exports.getMineurs = (_req, res, next) => {
  Mineur.find()
    .then((mineurs) => {
      res.status(200).json({
        message: "Les mineurs ont été récupérés avec succès",
        mineurs: mineurs,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getMineur = (req, res, next) => {
  const id = req.params.mineurId;

  Mineur.findById(id)
    .then((mineur) => {
      if (mineur) {
        res.status(200).json(mineur);
      } else {
        res.status(404).json({ message: "Le mineur n'a pas été trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createMineur = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas créer un mineur");
    error.statusCode = 401;
    throw error;
  }

  const mineur = new Mineur({
    email: req.body.email,
    nom: req.body.nom,
    motdepasse: req.body.motdepasse,
    niveau: req.body.niveau,
  });

  mineur
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Le mineur a été créé avec succès",
        mineur: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteMineur = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas supprimer un mineur");
    error.statusCode = 401;
    throw error;
  }

  const id = req.params.mineurId;

  Mineur.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({
        message: "Le mineur a été supprimé avec succès",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateMineur = (req, res, next) => {
  if (req.user.niveau !== 2) {
    const error = new Error("Vous ne pouvez pas modifier un mineur");
    error.statusCode = 401;
    throw error;
  }

  const id = req.params.mineurId;
  const updatedMineur = new Mineur({
    _id: id,
    email: req.body.email,
    nom: req.body.nom,
    motdepasse: req.body.motdepasse,
    niveau: req.body.niveau,
  });

  Mineur.findByIdAndUpdate(id, { $set: updatedMineur }, { new: true })
    .then(() => {
      res.status(200).json({
        message: "Le mineur a été mis à jour avec succès",
        mineur: updatedMineur,
      });
    })
    .catch((err) => {
      next(err);
    });
};
