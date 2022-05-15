"use strict";

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/** Vérifie si la requête a un token JWT valide */

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).send({ message: "Non authentifié" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_JWT);
  } catch (err) {
    return res.status(401).send({ message: "Non authentifié" });
  }
  if (!decodedToken) {
    return res.status(401).send({ message: "Non authentifié" });
  }
  // Passe le token décodé dans la requête pour pouvoir l'utiliser ailleurs
  req.user = decodedToken;
  next();
};
