const {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = require("../utils/dynamoClient.js");

const TABLE_NAME = process.env.GAMES_TABLE || "";

const getGames = async (req, res) => {
	try {
		const { leagueId, teamId } = req.query;
		let params = { TableName: TABLE_NAME };
		if (leagueId || teamId) {
			params.FilterExpression = [];
			params.ExpressionAttributeNames = {};
			params.ExpressionAttributeValues = {};
			if (leagueId) {
				params.FilterExpression.push("#l = :l");
				params.ExpressionAttributeNames["#l"] = "leagueId";
				params.ExpressionAttributeValues[":l"] = leagueId;
			}
			if (teamId) {
				params.FilterExpression.push("(homeTeamId = :t OR awayTeamId = :t)");
				params.ExpressionAttributeValues[":t"] = teamId;
			}
			params.FilterExpression = params.FilterExpression.join(" AND ");
		}
		const data = await ddbDocClient.send(new ScanCommand(params));
		res.json(data.Items || []);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch games" });
	}
};

const getGameById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await ddbDocClient.send(
			new GetCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		if (!data.Item) {
			res.status(404).json({ error: "Game not found" });
			return;
		}
		res.json(data.Item);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch game" });
	}
};

const createGame = async (req, res) => {
	try {
		const game = { ...req.body, id: req.body.id || crypto.randomUUID() };
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: game })
		);
		res.status(201).json(game);
	} catch (err) {
		res.status(500).json({ error: "Failed to create game" });
	}
};

const updateGame = async (req, res) => {
	try {
		const { id } = req.params;
		const { leagueId, homeTeamId, awayTeamId, date, score } = req.body;
		const updateExp = [];
		const expAttrNames = {};
		const expAttrValues = {};
		if (leagueId !== undefined) {
			updateExp.push("#l = :l");
			expAttrNames["#l"] = "leagueId";
			expAttrValues[":l"] = leagueId;
		}
		if (homeTeamId !== undefined) {
			updateExp.push("#h = :h");
			expAttrNames["#h"] = "homeTeamId";
			expAttrValues[":h"] = homeTeamId;
		}
		if (awayTeamId !== undefined) {
			updateExp.push("#a = :a");
			expAttrNames["#a"] = "awayTeamId";
			expAttrValues[":a"] = awayTeamId;
		}
		if (date !== undefined) {
			updateExp.push("#d = :d");
			expAttrNames["#d"] = "date";
			expAttrValues[":d"] = date;
		}
		if (score !== undefined) {
			updateExp.push("#s = :s");
			expAttrNames["#s"] = "score";
			expAttrValues[":s"] = score;
		}
		if (!updateExp.length) {
			res.status(400).json({ error: "No fields to update" });
			return;
		}
		const data = await ddbDocClient.send(
			new UpdateCommand({
				TableName: TABLE_NAME,
				Key: { id },
				UpdateExpression: "SET " + updateExp.join(", "),
				ExpressionAttributeNames: expAttrNames,
				ExpressionAttributeValues: expAttrValues,
				ReturnValues: "ALL_NEW",
			})
		);
		res.json(data.Attributes);
	} catch (err) {
		res.status(500).json({ error: "Failed to update game" });
	}
};

const deleteGame = async (req, res) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: "Failed to delete game" });
	}
};

module.exports = {
	getGames,
	getGameById,
	createGame,
	updateGame,
	deleteGame,
};
