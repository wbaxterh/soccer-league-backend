const {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = require("../utils/dynamoClient.js");

const TABLE_NAME = process.env.PLAYERS_TABLE || "";

const getPlayers = async (req, res) => {
	try {
		const { teamId, leagueId } = req.query;
		let params = { TableName: TABLE_NAME };
		if (teamId || leagueId) {
			params.FilterExpression = [];
			params.ExpressionAttributeNames = {};
			params.ExpressionAttributeValues = {};
			if (teamId) {
				params.FilterExpression.push("#t = :t");
				params.ExpressionAttributeNames["#t"] = "teamId";
				params.ExpressionAttributeValues[":t"] = teamId;
			}
			if (leagueId) {
				params.FilterExpression.push("#l = :l");
				params.ExpressionAttributeNames["#l"] = "leagueId";
				params.ExpressionAttributeValues[":l"] = leagueId;
			}
			params.FilterExpression = params.FilterExpression.join(" AND ");
		}
		const data = await ddbDocClient.send(new ScanCommand(params));
		res.json(data.Items || []);
	} catch (err) {
		console.error(
			"Failed to fetch players",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to fetch players",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const getPlayerById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await ddbDocClient.send(
			new GetCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		if (!data.Item) {
			res.status(404).json({ error: "Player not found" });
			return;
		}
		res.json(data.Item);
	} catch (err) {
		console.error("Failed to fetch player", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to fetch player",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const createPlayer = async (req, res) => {
	try {
		const player = {
			...req.body,
			id: req.body.id || crypto.randomUUID(),
		};
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: player })
		);
		res.status(201).json(player);
	} catch (err) {
		console.error(
			"Failed to create player",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to create player",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const updatePlayer = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, teamId, leagueId, position } = req.body;
		const updateExp = [];
		const expAttrNames = {};
		const expAttrValues = {};
		if (name !== undefined) {
			updateExp.push("#n = :n");
			expAttrNames["#n"] = "name";
			expAttrValues[":n"] = name;
		}
		if (teamId !== undefined) {
			updateExp.push("#t = :t");
			expAttrNames["#t"] = "teamId";
			expAttrValues[":t"] = teamId;
		}
		if (leagueId !== undefined) {
			updateExp.push("#l = :l");
			expAttrNames["#l"] = "leagueId";
			expAttrValues[":l"] = leagueId;
		}
		if (position !== undefined) {
			updateExp.push("#p = :p");
			expAttrNames["#p"] = "position";
			expAttrValues[":p"] = position;
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
		console.error(
			"Failed to update player",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to update player",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const deletePlayer = async (req, res) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		console.error(
			"Failed to delete player",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to delete player",
			details: err && err.message ? err.message : String(err),
		});
	}
};

module.exports = {
	getPlayers,
	getPlayerById,
	createPlayer,
	updatePlayer,
	deletePlayer,
};
