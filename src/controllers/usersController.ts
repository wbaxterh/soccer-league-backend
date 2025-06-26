import { Request, Response } from "express";
import {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import ddbDocClient from "../utils/dynamoClient";
import { User } from "../models/User";

const TABLE_NAME = process.env.USERS_TABLE || "";

export const getUsers = async (req: Request, res: Response) => {
	try {
		const data = await ddbDocClient.send(
			new ScanCommand({ TableName: TABLE_NAME })
		);
		res.json(data.Items || []);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch users" });
	}
};

export const getUserById = async (req: Request, res: Response) => {
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
		res.status(500).json({ error: "Failed to fetch user" });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const user: User = { ...req.body, id: req.body.id || crypto.randomUUID() };
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: user })
		);
		res.status(201).json(user);
	} catch (err) {
		res.status(500).json({ error: "Failed to create user" });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { email, name, role } = req.body;
		const updateExp = [];
		const expAttrNames: Record<string, string> = {};
		const expAttrValues: Record<string, any> = {};
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
		res.status(500).json({ error: "Failed to update user" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: "Failed to delete user" });
	}
};
