const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	credentials:
		process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
			? {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			  }
			: undefined,
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = ddbDocClient;
