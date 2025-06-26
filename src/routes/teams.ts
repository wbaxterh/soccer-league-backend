import { Router } from "express";
import * as teamsController from "../controllers/teamsController";

const router = Router();

router.get("/", teamsController.getTeams); // Optionally filter by league
router.get("/:id", teamsController.getTeamById);
router.post("/", teamsController.createTeam);
router.put("/:id", teamsController.updateTeam);
router.delete("/:id", teamsController.deleteTeam);

export default router;
