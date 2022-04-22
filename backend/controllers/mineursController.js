"use strict";

const Mineur = require("../models/mineur");

exports.getMineurs = (_req, res) => {
  Mineur.find()
    .then((mineurs) => {
      res.status(200).json({
        message: "Les mineurs ont été récupérés avec succès",
        mineurs: mineurs,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la récupération des mineurs",
        error: error,
      });
    });
};

exports.getMineur = (req, res) => {
  const id = req.params.mineurId;
  Mineur.findById(id)
    .then((mineur) => {
      if (mineur) {
        res.status(200).json(mineur);
      } else {
        res.status(404).json({ message: "Le mineur n'a pas été trouvé" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la récupération du mineur",
        error: error,
      });
    });
};

exports.createMineur = (req, res) => {
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
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la création du mineur",
        error: error,
      });
    });
};

exports.deleteMineur = (req, res) => {
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
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la suppression du mineur",
        error: error,
      });
    });
};

exports.updateMineur = (req, res) => {
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
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la mise à jour du mineur",
        error: error,
      });
    });
};
