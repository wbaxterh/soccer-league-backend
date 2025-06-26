import app from "./app";

// Only start the server locally if not running in Lambda
if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
	const PORT = process.env.PORT || 3010;
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

// Export Lambda handler for AWS
import serverlessExpress from "@vendia/serverless-express";
export const handler = serverlessExpress({ app });
