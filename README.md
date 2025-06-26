# Soccer League Backend API

A Node.js + Express REST API backend for managing soccer leagues, teams, players, games, users, and standings. Uses AWS DynamoDB for storage. Designed for deployment with AWS SAM CLI and API Gateway.

## Features

- TypeScript
- Express.js
- AWS SDK v3 (DynamoDB)
- Environment variable support
- CORS enabled
- Modular code structure

## Project Structure

```
src/
  routes/
  controllers/
  models/
  utils/
  app.ts
  server.ts
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Copy and edit the example environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS credentials and DynamoDB table names
   ```
3. **Run locally:**
   ```bash
   npx ts-node src/server.ts
   ```
4. **Build:**
   ```bash
   npx tsc
   ```
5. **Deploy with AWS SAM CLI:**
   See [AWS SAM documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli.html)

## Example .env file

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
LEAGUES_TABLE=SL-LeaguesTable
TEAMS_TABLE=SL-TeamsTable
PLAYERS_TABLE=SL-PlayersTable
GAMES_TABLE=SL-GamesTable
USERS_TABLE=SL-UsersTable
PORT=3000
```
