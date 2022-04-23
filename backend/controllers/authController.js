"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/mineur");

exports.login = (req, res, next) => {
  /*  #swagger.auto = false
      
      #swagger.tags = ['Authentification']
      #swagger.path = '/auth/login'
      #swagger.method = 'post'
      #swagger.description = "Authentification d'un utilisateur"
      #swagger.produces = ['application/json']
      #swagger.consumes = ['application/json']
  */
  /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Informations de connexion',
                required: 'true',
                schema: {
                    $email: 'email@exemple.com',
                    $motdepasse: 'motdepasse123',
                }
  } */
  /* #swagger.responses[200] = {
            description: "Token d'authentification",
            schema: {
                token: 'json_web_token'
            }
        }   
    */

  const email = req.body.email;
  const motdepasse = req.body.motdepasse;

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Utilisateur non trouvée");
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      console.log("loadedUser", loadedUser);
      return bcrypt.compare(motdepasse, user.motdepasse);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Mauvais mot de passe !");
        error.statusCode = 401;
        throw error;
      }
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
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      res
        .status(err.statusCode)
        .json({ message: err.message, statusCode: err.statusCode });
    });
};

exports.signup = (req, res, next) => {
  /*  #swagger.tags = ['Authentification']
      #swagger.description = "Création d'un utilisateur"
      #swagger.path = '/auth/signup'
  */
  const email = req.body.email;
  const nom = req.body.nom;
  const motdepasse = req.body.motdepasse;
  const niveau = req.body.niveau;

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
      res
        .status(201)
        .json({ message: "Utilisateur créé !", userId: result.id });
    })
    .catch((err) => {
      next(err);
    });
};
