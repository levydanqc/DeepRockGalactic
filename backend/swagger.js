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
      $attributes: {
        $email: "Malinda45@hotmail.com",
        $nom: "Earline_Turner",
        $motdepasse:
          "$2a$12$Rzjj1vInymnROuXepA0qL.1g.O72xHds4RXgFRdYR7QKnRGR0.tLe",
        $niveau: 1,
        $createdAt: "2022-05-16T18:34:49.396Z",
        $updatedAt: "2022-05-16T18:34:49.396Z",
      },
      $links: {
        $self:
          process.env.URL ??
          "http://localhost:3000" + "/mineurs/62829949dfc507d6c4d0cedf",
        $collection: process.env.URL ?? "http://localhost:3000" + "/mineurs",
      },
      $relationships: {},
    },
    Planete: {
      $attributes: {
        $nom: "sonya",
        $image: "http://placeimg.com/640/480",
      },
      $links: {
        $self:
          process.env.URL ??
          "http://localhost:3000" + "/planetes/62829a3429fdd0fd4b2ec525",
        $collection: process.env.URL ?? "http://localhost:3000" + "/planetes",
      },
      $relationships: {},
    },
    Contrat: {
      $attributes: {
        $planeteId: "628290ad34dcba8b58f94004",
        $prime: 203,
        $danger: 1,
        $ressource: "Concrete",
        $quantiteRessource: 605,
        $dateExpiration: "2022-05-21T10:55:19.000Z",
        $createdAt: "2022-05-16T17:59:07.351Z",
        $updatedAt: "2022-05-16T17:59:07.351Z",
      },
      $links: {
        $self:
          process.env.URL ??
          "http://localhost:3000" + "/contrats/628290eb34dcba8b58f94007",
        $collection: process.env.URL ?? "http://localhost:3000" + "/contrats",
        $reserve:
          process.env.URL ??
          "http://localhost:3000" + "/reservations/628290eb34dcba8b58f94007",
      },
      $relationships: {
        $planete: {
          $links: {
            $related:
              process.env.URL ??
              "http://localhost:3000" + "/planetes/628290ad34dcba8b58f94004",
          },
        },
      },
    },
    Reservation: {
      $attributes: {
        $mineurId: {
          $ref: "#/definitions/Mineur",
        },
        $contratId: {
          $ref: "#/definitions/Contrat",
        },
        $estTermine: false,
        $createdAt: "2022-05-16T16:36:43.632Z",
        $updatedAt: "2022-05-16T16:36:43.632Z",
      },
      $links: {
        $self:
          process.env.URL ??
          "http://localhost:3000" + "/reservations/62827d9b72a5595a09618d55",
        $collection:
          process.env.URL ?? "http://localhost:3000" + "/reservations",
      },
      $relationships: {
        $mineur: {
          $links: {
            $related:
              process.env.URL ??
              "http://localhost:3000" + "/mineurs/62827ababfe5f11e9edb79b1",
          },
        },
        $contrat: {
          $links: {
            $related:
              process.env.URL ??
              "http://localhost:3000" + "/contrats/6265f757995a50c7205fae51",
          },
        },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
