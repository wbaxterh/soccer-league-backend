const express = require("express");
const gamesController = require("../controllers/gamesController.js");

const router = express.Router();

router.get("/", gamesController.getGames); // Optionally filter by league or team
router.get("/:id", gamesController.getGameById);
router.post("/", gamesController.createGame);
router.put("/:id", gamesController.updateGame);
router.delete("/:id", gamesController.deleteGame);

module.exports = router;
