const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const leagueRoutes = require("./routes/leagues");
const teamRoutes = require("./routes/teams");
const playerRoutes = require("./routes/players");
const gameRoutes = require("./routes/games");
const userRoutes = require("./routes/users");

app.use("/leagues", leagueRoutes);
app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);
app.use("/games", gameRoutes);
app.use("/users", userRoutes);

// Basic error handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
