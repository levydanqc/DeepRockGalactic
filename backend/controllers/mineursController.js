"use strict";

const Mineur = require("../models/mineur");
const bcrypt = require("bcryptjs");

exports.getMineurs = (_req, res, next) => {
  /* 
      #swagger.tags = ['Mineurs']
      #swagger.description = "Retourne la liste des mineurs"
      #swagger.summary = "Obtenir tous les mineurs"
  */
  Mineur.find()
    .then((mineurs) => {
      /* #swagger.responses[200] = { 
            description: "Liste des mineurs",
            schema: [{
                "$ref": "#/definitions/Mineur"
            }]
        }
      */
      res.status(200).json({
        data: formated(mineurs),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getMineur = (req, res, next) => {
  /* 
      #swagger.tags = ['Mineurs']
      #swagger.summary = "Obtenir un mineur par id"
  */
  /*
      #swagger.parameters['mineurId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */ const id = req.params.mineurId;

  Mineur.findById(id)
    .then((mineur) => {
      if (mineur) {
        /* #swagger.responses[200] = { 
            description: "Mineur",
            schema: {
                "$ref": "#/definitions/Mineur"
            }
        }
      */
        res.status(200).json({
          data: formated(mineur),
        });
      } else {
        res.status(404).json({ message: "Mineur non trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.createMineur = (req, res, next) => {
  /* 
      #swagger.tags = ['Mineurs']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Créer un mineur"
  */
  /*
    #swagger.parameters["body"] = {
        "in": "body",
        "name": "Mineur",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Mineur"
        }
    }
  */
  if (req.user.niveau !== 2) {
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas effectuer cette action." });
  }

  const { email, nom, motdepasse, niveau } = req.body;

  Mineur.findOne({ email }).then((mineur) => {
    if (mineur) {
      /* #swagger.responses[409] = {
            description: "Mineur existant",
        }
      */
      res.status(400).json({ message: "Mineur existant" });
    } else {
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
        .then((mineur) => {
          /* #swagger.responses[201] = { 
                description: "Mineur créé",
                schema: {
                    message: "Mineur créé avec succès!",
                    mineur: {
                        "$ref": "#/definitions/Mineur"
                    }
                }
            }
          */
          res.status(201).json({
            message: "Mineur créé avec succès!",
            data: formated(mineur),
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
};

exports.deleteMineur = (req, res, next) => {
  /* 
      #swagger.tags = ['Mineurs']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Supprimer un mineur"
  */
  /*
      #swagger.parameters['mineurId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  if (req.user.niveau !== 2) {
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas effectuer cette action." });
  }

  const mineurId = req.params.mineurId;

  Mineur.findByIdAndDelete(mineurId)
    .then((mineur) => {
      if (mineur) {
        /* #swagger.responses[200] = { 
            description: "Mineur supprimé",
            schema: {
                message: "Mineur supprimé avec succès!"
            }
        }
      */
        res.status(200).json({
          message: "Mineur supprimé avec succès!",
        });
      } else {
        res.status(404).json({ message: "Mineur non trouvé" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateMineur = (req, res, next) => {
  /* 
      #swagger.tags = ['Mineurs']
      #swagger.description = "Nécessite d'être de niveau 2"
      #swagger.summary = "Modifier un mineur"
  */
  /*
      #swagger.parameters['mineurId'] = {
        value: '626339247fe023c3b50ba0d4'
      }
 */
  /*
      #swagger.parameters["body"] = {
        "in": "body",
        "name": "Mineur",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Mineur"
        }
    }
  */
  if (req.user.niveau !== 2) {
    return res
      .status(403)
      .json({ message: "Vous ne pouvez pas effectuer cette action." });
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
            /*  #swagger.responses[200] = { 
                  description: "Mineur modifié",
                  schema: {
                      message: "Mineur modifié avec succès!",
                      mineur: {
                          "$ref": "#/definitions/Mineur"
                      }
                  }
              }
            */
            res.status(200).json({
              message: "Mineur modifié avec succès",
              data: formated(mineur),
            });
          } else {
            res.status(404).json({ message: "Mineur non trouvé" });
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

function formated(obj) {
  const url = process.env.URL || "http://localhost:3000";

  const links = [
    {
      rel: "self",
      method: "GET",
      href: `${url}/mineurs/${obj._id}`,
    },
    {
      rel: "create",
      method: "POST",
      href: `${url}/mineurs/`,
    },
    {
      rel: "update",
      method: "PUT",
      href: `${url}/mineurs/${obj._id}`,
    },
    {
      rel: "delete",
      method: "DELETE",
      href: `${url}/mineurs/${obj._id}`,
    },
  ];
  const relationships = {};

  if (obj.length > 0) {
    const objs = [];
    for (let i = 0; i < obj.length; i++) {
      objs.push(formated(obj[i]));
    }
    return objs;
  }

  return { attributes: obj, links, relationships };
}
