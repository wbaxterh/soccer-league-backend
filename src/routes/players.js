const express = require("express");
const playersController = require("../controllers/playersController.js");

const router = express.Router();

router.get("/", playersController.getPlayers); // Optionally filter by team or league
router.get("/:id", playersController.getPlayerById);
router.post("/", playersController.createPlayer);
router.put("/:id", playersController.updatePlayer);
router.delete("/:id", playersController.deletePlayer);

module.exports = router;
