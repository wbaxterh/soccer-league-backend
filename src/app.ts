import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
import leagueRoutes from "./routes/leagues";
import teamRoutes from "./routes/teams";
import playerRoutes from "./routes/players";
import gameRoutes from "./routes/games";
import userRoutes from "./routes/users";

app.use("/leagues", leagueRoutes);
app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);
app.use("/games", gameRoutes);
app.use("/users", userRoutes);

// Basic error handler
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
);

export default app;
