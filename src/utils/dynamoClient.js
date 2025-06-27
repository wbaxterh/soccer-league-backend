const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	...(!isLambda &&
	process.env.AWS_ACCESS_KEY_ID &&
	process.env.AWS_SECRET_ACCESS_KEY
		? {
				credentials: {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				},
		  }
		: {}),
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = ddbDocClient;
