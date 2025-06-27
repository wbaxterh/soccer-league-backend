const {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = require("../utils/dynamoClient.js");

const TABLE_NAME = process.env.USERS_TABLE || "";

const getUsers = async (req, res) => {
	try {
		const data = await ddbDocClient.send(
			new ScanCommand({ TableName: TABLE_NAME })
		);
		res.json(data.Items || []);
	} catch (err) {
		console.error("Failed to fetch users", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to fetch users",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await ddbDocClient.send(
			new GetCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		if (!data.Item) {
			res.status(404).json({ error: "User not found" });
			return;
		}
		res.json(data.Item);
	} catch (err) {
		console.error("Failed to fetch user", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to fetch user",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const createUser = async (req, res) => {
	try {
		const user = { ...req.body, id: req.body.id || crypto.randomUUID() };
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: user })
		);
		res.status(201).json(user);
	} catch (err) {
		console.error("Failed to create user", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to create user",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { email, name, role } = req.body;
		const updateExp = [];
		const expAttrNames = {};
		const expAttrValues = {};
		if (email !== undefined) {
			updateExp.push("#e = :e");
			expAttrNames["#e"] = "email";
			expAttrValues[":e"] = email;
		}
		if (name !== undefined) {
			updateExp.push("#n = :n");
			expAttrNames["#n"] = "name";
			expAttrValues[":n"] = name;
		}
		if (role !== undefined) {
			updateExp.push("#r = :r");
			expAttrNames["#r"] = "role";
			expAttrValues[":r"] = role;
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
		console.error("Failed to update user", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to update user",
			details: err && err.message ? err.message : String(err),
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		console.error("Failed to delete user", err && err.stack ? err.stack : err);
		res.status(500).json({
			error: "Failed to delete user",
			details: err && err.message ? err.message : String(err),
		});
	}
};

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
};
