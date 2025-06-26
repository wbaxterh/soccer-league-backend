import { Router } from "express";
import * as gamesController from "../controllers/gamesController";

const router = Router();

router.get("/", gamesController.getGames); // Optionally filter by league or team
router.get("/:id", gamesController.getGameById);
router.post("/", gamesController.createGame);
router.put("/:id", gamesController.updateGame);
router.delete("/:id", gamesController.deleteGame);

export default router;
