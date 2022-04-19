"use strict";

const express = require("express");

const router = express.Router();

const mineursController = require("../controllers/mineursController");
const isAuth = require("../middleware/is-auth");

// /mineur/ => GET
router.get("/mineurs/", mineursController.getMineurs);

// /mineur/ => POST
router.post("/mineurs/", mineursController.createMineur);

// /mineur/mineurId => GET
router.get("/mineurs/:mineurId", mineursController.getMineur);

// /mineur/mineurId => PUT
router.put("/mineurs/:mineurId", isAuth, mineursController.updateMineur);

// /mineur/:mineur => DELETE
router.delete("/mineurs/:mineurId", isAuth, mineursController.deleteMineur);

module.exports = router;
