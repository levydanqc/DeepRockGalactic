"use strict";

const Mineur = require("../models/mineur");
const bcrypt = require("bcryptjs");

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

  const { email, nom, motdepasse, niveau } = req.body;

  bcrypt
    .hash(motdepasse, 12)
    .then((hashedPassword) => {
      const mineur = new Mineur({
        email: email,
        nom: nom,
        motdepasse: hashedPassword,
        niveau: niveau,
      });
      return mineur.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Le mineur a été créé avec succès!", mineur: result });
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

  const mineurId = req.params.mineurId;
  const { email, nom, motdepasse, niveau } = req.body;

  bcrypt
    .hash(motdepasse, 12)
    .then((hashedPassword) => {
      Mineur.findById(mineurId)
        .then((mineur) => {
          if (mineur) {
            mineur.email = email;
            mineur.nom = nom;
            mineur.motdepasse = hashedPassword;
            mineur.niveau = niveau;
            mineur.save();
            res.status(200).json({
              message: "Le mineur a été modifié avec succès",
              mineur: mineur,
            });
          } else {
            res.status(404).json({ message: "Le mineur n'a pas été trouvé" });
          }
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
