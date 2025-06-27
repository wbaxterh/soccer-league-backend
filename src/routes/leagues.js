const express = require("express");
const leaguesController = require("../controllers/leaguesController.js");

const router = express.Router();

router.get("/", leaguesController.getLeagues);
router.get("/:id", leaguesController.getLeagueById);
router.post("/", leaguesController.createLeague);
router.put("/:id", leaguesController.updateLeague);
router.delete("/:id", leaguesController.deleteLeague);
router.get("/:id/standings", leaguesController.getLeagueStandings);
router.put("/:id/standings-options", leaguesController.updateStandingsOptions);

module.exports = router;
