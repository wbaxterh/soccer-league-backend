const express = require("express");
const teamsController = require("../controllers/teamsController.js");

const router = express.Router();

router.get("/", teamsController.getTeams); // Optionally filter by league
router.get("/:id", teamsController.getTeamById);
router.post("/", teamsController.createTeam);
router.put("/:id", teamsController.updateTeam);
router.delete("/:id", teamsController.deleteTeam);

module.exports = router;
