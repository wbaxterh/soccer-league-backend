const crypto = require("crypto");
const {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = require("../utils/dynamoClient.js");

const TABLE_NAME = process.env.TEAMS_TABLE || "";

const getTeams = async (req, res) => {
	try {
		const { leagueId } = req.query;
		let params = { TableName: TABLE_NAME };
		if (leagueId) {
			params.FilterExpression = "#l = :l";
			params.ExpressionAttributeNames = { "#l": "leagueId" };
			params.ExpressionAttributeValues = { ":l": leagueId };
		}
		const data = await ddbDocClient.send(new ScanCommand(params));
		res.json(data.Items || []);
	} catch (err) {
		console.error("Failed to fetch teams", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to fetch teams",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const getTeamById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await ddbDocClient.send(
			new GetCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		if (!data.Item) {
			res.status(404).json({ error: "Team not found" });
			return;
		}
		res.json(data.Item);
	} catch (err) {
		console.error("Failed to fetch team", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to fetch team",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const createTeam = async (req, res) => {
	try {
		const team = { ...req.body, id: req.body.id || crypto.randomUUID() };
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: team })
		);
		res.status(201).json(team);
	} catch (err) {
		console.error("Failed to create team", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to create team",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const updateTeam = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, leagueId, players } = req.body;
		const updateExp = [];
		const expAttrNames = {};
		const expAttrValues = {};
		if (name !== undefined) {
			updateExp.push("#n = :n");
			expAttrNames["#n"] = "name";
			expAttrValues[":n"] = name;
		}
		if (leagueId !== undefined) {
			updateExp.push("#l = :l");
			expAttrNames["#l"] = "leagueId";
			expAttrValues[":l"] = leagueId;
		}
		if (players !== undefined) {
			updateExp.push("#p = :p");
			expAttrNames["#p"] = "players";
			expAttrValues[":p"] = players;
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
		console.error("Failed to update team", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to update team",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const deleteTeam = async (req, res) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		console.error("Failed to delete team", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to delete team",
			details: err && err.message ? err.message : String(err),
		});
	}
};

module.exports = {
	getTeams,
	getTeamById,
	createTeam,
	updateTeam,
	deleteTeam,
};
