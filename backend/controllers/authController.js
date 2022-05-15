"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/mineur");

exports.login = (req, res, next) => {
  /* 
      #swagger.tags = ['Authentification']
      #swagger.description = "Retourne un token d'authentification"
      #swagger.summary = "Connexion d'un utilisateur"
  */
  /*
    #swagger.parameters["body"] = {
        "in": "body",
        "name": "Utilisateur",
        "description": 'Informations de l\'utilisateur',
        "required": true,
        "schema": {
          "email": "email@exemple.com",
          "motdepasse": "motdepasse123"
        }
    }
  */
  const email = req.body.email;
  const motdepasse = req.body.motdepasse;

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new Error();
      }
      loadedUser = user;
      return bcrypt.compare(motdepasse, user.motdepasse);
    })
    .then((isEqual) => {
      console.log(isEqual);
      if (!isEqual) {
        /* #swagger.responses[401] = {
            description: "Email ou mot de passe invalide",
        }
        */
        throw new Error();
      } else {
        const token = jwt.sign(
          {
            email: loadedUser.email,
            nom: loadedUser.nom,
            userId: loadedUser._id.toString(),
            niveau: loadedUser.niveau,
          },
          process.env.SECRET_JWT,
          { expiresIn: "1h" }
        );
        /* #swagger.responses[200] = { 
            description: "Utilisateur authentifié",
            schema: {
                token: "string"
            }
        }
      */
        res.status(200).json({ token: token });
      }
    })
    .catch(() => {
      res.status(401).json({ message: "Email ou mot de passe invalide" });
    });
};

exports.signup = (req, res, next) => {
  /*  #swagger.tags = ['Authentification']
      #swagger.description = "Retourne l'id de l'utilisateur"
      #swagger.summary = "Inscription d'un utilisateur"
  */
  /*
    #swagger.parameters["body"] = {
        "in": "body",
        "name": "Utilisateur",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Mineur"
        }
    }
  */

  const email = req.body.email;
  const nom = req.body.nom;
  const motdepasse = req.body.motdepasse;
  const niveau = req.body.niveau;

  User.findOne({ email }).then((mineur) => {
    if (mineur) {
      /* #swagger.responses[409] = {
            description: "Utilisateur existant",
        }
      */
      res.status(400).json({ message: "Utilisateur existant" });
    } else {
      bcrypt
        .hash(motdepasse, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            nom: nom,
            motdepasse: hashedPassword,
            niveau: niveau,
          });
          return user.save();
        })
        .then((result) => {
          /* #swagger.responses[201] = { 
              description: "Utilisateur créé",
              schema: {
                  userId: "string"
              }
          }
        */
          res
            .status(201)
            .json({ message: "Utilisateur créé !", userId: result.id });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
};
