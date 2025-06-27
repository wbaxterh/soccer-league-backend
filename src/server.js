const app = require("./app");

// Only start the server locally if not running in Lambda
if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
	const PORT = process.env.PORT || 3010;
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

// Export Lambda handler for AWS
const serverlessExpress = require("@vendia/serverless-express");
exports.handler = serverlessExpress({ app });
