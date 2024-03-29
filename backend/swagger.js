const options = {
  language: "fr",
  openapi: "3.0.0",
};

const swaggerAutogen = require("swagger-autogen")(options);

const doc = {
  info: {
    version: "1.0.0",
    title: "Deep Rock Galactic API",
    description:
      "API de Deep Rock Galactic, un jeu de stratégie en ligne de type RTS",
  },
  host: process.env.URL ?? "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Authentification",
      description: "Gestion des utilisateurs",
    },
    {
      name: "Contrats",
      description: "Gestion des contrats",
    },
    {
      name: "Mineurs",
      description: "Gestion des mineurs",
    },
    {
      name: "Planètes",
      description: "Gestion des planètes",
    },
    {
      name: "Réservations",
      description: "Gestion des réservations",
    },
    {
      name: "Recherche",
      description: "Système de recherche",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  definitions: {
    Mineur: {
      $email: "email@exemple.com",
      $nom: "Joe Dassin",
      $motdepasse: "motdepasse123",
      $niveau: 1,
    },
    Planete: {
      $nom: "Terre",
      $image: "https://picsum.photos/200",
    },
    Contrat: {
      $prime: 100,
      $danger: 1,
      $ressource: "fer",
      $quantiteRessource: 100,
      $dateExpiration: "2022-01-01",
      $planeteId: "6283da4158b47d87db5f485b",
    },
    Reservation: {
      $mineurId: "62674b7e563f2f0b49f8c8ba",
      $contratId: "6283e8a0c877f1f7d11423d1",
      $estTermine: false,
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
