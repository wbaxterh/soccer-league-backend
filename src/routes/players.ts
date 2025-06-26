import { Router } from "express";
import * as playersController from "../controllers/playersController";

const router = Router();

router.get("/", playersController.getPlayers); // Optionally filter by team or league
router.get("/:id", playersController.getPlayerById);
router.post("/", playersController.createPlayer);
router.put("/:id", playersController.updatePlayer);
router.delete("/:id", playersController.deletePlayer);

export default router;
