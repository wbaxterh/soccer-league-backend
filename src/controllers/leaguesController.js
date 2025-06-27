const {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = require("../utils/dynamoClient.js");

const TABLE_NAME = process.env.LEAGUES_TABLE || "";

const getLeagues = async (req, res) => {
	try {
		const data = await ddbDocClient.send(
			new ScanCommand({ TableName: TABLE_NAME })
		);
		res.json(data.Items || []);
	} catch (err) {
		console.error(
			"Failed to fetch leagues",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to fetch leagues",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const getLeagueById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await ddbDocClient.send(
			new GetCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		if (!data.Item) {
			res.status(404).json({ error: "League not found" });
			return;
		}
		res.json(data.Item);
	} catch (err) {
		console.error("Failed to fetch league", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to fetch league",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const createLeague = async (req, res) => {
	try {
		const league = {
			...req.body,
			id: req.body.id || crypto.randomUUID(),
		};
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: league })
		);
		res.status(201).json(league);
	} catch (err) {
		console.error(
			"Failed to create league",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to create league",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const updateLeague = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, season, standingsOptions } = req.body;
		const updateExp = [];
		const expAttrNames = {};
		const expAttrValues = {};
		if (name !== undefined) {
			updateExp.push("#n = :n");
			expAttrNames["#n"] = "name";
			expAttrValues[":n"] = name;
		}
		if (season !== undefined) {
			updateExp.push("#s = :s");
			expAttrNames["#s"] = "season";
			expAttrValues[":s"] = season;
		}
		if (standingsOptions !== undefined) {
			updateExp.push("#so = :so");
			expAttrNames["#so"] = "standingsOptions";
			expAttrValues[":so"] = standingsOptions;
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
			"Failed to update league",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to update league",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const deleteLeague = async (req, res) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		console.error(
			"Failed to delete league",
			err && err.stack ? err.stack : err
		);
		res.status(500).json({
			error: "Failed to delete league",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const getLeagueStandings = async (req, res) => {
	res.status(501).json({ error: "Not implemented" });
};

const updateStandingsOptions = async (req, res) => {
	res.status(501).json({ error: "Not implemented" });
};

module.exports = {
	getLeagues,
	getLeagueById,
	createLeague,
	updateLeague,
	deleteLeague,
	getLeagueStandings,
	updateStandingsOptions,
};
