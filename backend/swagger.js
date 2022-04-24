const options = {
  language: "fr",
};

const swaggerAutogen = require("swagger-autogen")(options);

const doc = {
  info: {
    version: "1.0.0",
    title: "Deep Rock Galactic API",
    description:
      "API de Deep Rock Galactic, un jeu de stratégie en ligne de type RTS",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  // tags: [
  //   {
  //     name: "Authen",
  //     description: "Endpoints",
  //   },
  // ],
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header",
    },
    petstore_auth: {
      type: "oauth2",
      authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
      flow: "implicit",
      scopes: {
        read_pets: "read your pets",
        write_pets: "modify pets in your account",
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
    },
    Reservation: {
      $mineurId: {
        $ref: "#/definitions/Mineur",
      },
      $planeteId: {
        $ref: "#/definitions/Planete",
      },
      $estTermine: false,
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => require("./app"));
