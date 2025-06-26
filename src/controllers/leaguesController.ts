import { Request, Response } from "express";
import {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import ddbDocClient from "../utils/dynamoClient";
import { League } from "../models/League";

const TABLE_NAME = process.env.LEAGUES_TABLE || "";

export const getLeagues = async (req: Request, res: Response) => {
	try {
		const data = await ddbDocClient.send(
			new ScanCommand({ TableName: TABLE_NAME })
		);
		res.json(data.Items || []);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch leagues" });
	}
};

export const getLeagueById = async (req: Request, res: Response) => {
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
		res.status(500).json({ error: "Failed to fetch league" });
	}
};

export const createLeague = async (req: Request, res: Response) => {
	try {
		const league: League = {
			...req.body,
			id: req.body.id || crypto.randomUUID(),
		};
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: league })
		);
		res.status(201).json(league);
	} catch (err) {
		res.status(500).json({ error: "Failed to create league" });
	}
};

export const updateLeague = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, season, standingsOptions } = req.body;
		const updateExp = [];
		const expAttrNames: Record<string, string> = {};
		const expAttrValues: Record<string, any> = {};
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
		res.status(500).json({ error: "Failed to update league" });
	}
};

export const deleteLeague = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: "Failed to delete league" });
	}
};

export const getLeagueStandings = async (req: Request, res: Response) => {
	res.status(501).json({ error: "Not implemented" });
};

export const updateStandingsOptions = async (req: Request, res: Response) => {
	res.status(501).json({ error: "Not implemented" });
};
