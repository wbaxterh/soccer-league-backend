import { Request, Response } from "express";
import {
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
	DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import ddbDocClient from "../utils/dynamoClient";
import { Player } from "../models/Player";

const TABLE_NAME = process.env.PLAYERS_TABLE || "";

export const getPlayers = async (req: Request, res: Response) => {
	try {
		const { teamId, leagueId } = req.query;
		let params: any = { TableName: TABLE_NAME };
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
		res.status(500).json({ error: "Failed to fetch players" });
	}
};

export const getPlayerById = async (req: Request, res: Response) => {
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
		res.status(500).json({ error: "Failed to fetch player" });
	}
};

export const createPlayer = async (req: Request, res: Response) => {
	try {
		const player: Player = {
			...req.body,
			id: req.body.id || crypto.randomUUID(),
		};
		await ddbDocClient.send(
			new PutCommand({ TableName: TABLE_NAME, Item: player })
		);
		res.status(201).json(player);
	} catch (err) {
		res.status(500).json({ error: "Failed to create player" });
	}
};

export const updatePlayer = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, teamId, leagueId, position } = req.body;
		const updateExp = [];
		const expAttrNames: Record<string, string> = {};
		const expAttrValues: Record<string, any> = {};
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
		res.status(500).json({ error: "Failed to update player" });
	}
};

export const deletePlayer = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await ddbDocClient.send(
			new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
		);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: "Failed to delete player" });
	}
};
