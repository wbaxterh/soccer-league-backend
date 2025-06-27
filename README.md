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

## API Endpoints

### Leagues

- `GET    /leagues` — List all leagues
- `GET    /leagues/:id` — Get a league by ID
- `POST   /leagues` — Create a new league
- `PUT    /leagues/:id` — Update a league
- `DELETE /leagues/:id` — Delete a league
- `GET    /leagues/:id/standings` — Get league standings (not implemented)
- `PUT    /leagues/:id/standings-options` — Update standings options (not implemented)

### Teams

- `GET    /teams` — List all teams (optionally filter by league)
- `GET    /teams/:id` — Get a team by ID
- `POST   /teams` — Create a new team
- `PUT    /teams/:id` — Update a team
- `DELETE /teams/:id` — Delete a team

### Players

- `GET    /players` — List all players (optionally filter by team or league)
- `GET    /players/:id` — Get a player by ID
- `POST   /players` — Create a new player
- `PUT    /players/:id` — Update a player
- `DELETE /players/:id` — Delete a player

### Games

- `GET    /games` — List all games (optionally filter by league or team)
- `GET    /games/:id` — Get a game by ID
- `POST   /games` — Create a new game
- `PUT    /games/:id` — Update a game
- `DELETE /games/:id` — Delete a game

### Users

- `GET    /users` — List all users
- `GET    /users/:id` — Get a user by ID
- `POST   /users` — Create a new user
- `PUT    /users/:id` — Update a user
- `DELETE /users/:id` — Delete a user

## Data Models

### League

```json
{
	"id": "string",
	"name": "string",
	"type": "string",
	"demographic": "string",
	"division": "string",
	"sport": "string",
	"startDate": "string",
	"endDate": "string",
	"status": "string",
	"teamFee": "string",
	"playerFee": "string",
	"otherFeeInfo": "string",
	"moreInfo": "string",
	"standingsOptions": {}
}
```

### Team

```json
{
	"id": "string",
	"name": "string",
	"leagueId": "string",
	"players": ["string"]
}
```

### Player

```json
{
	"id": "string",
	"name": "string",
	"teamId": "string",
	"leagueId": "string",
	"position": "string"
}
```

### Game

```json
{
	"id": "string",
	"leagueId": "string",
	"homeTeamId": "string",
	"awayTeamId": "string",
	"date": "string",
	"score": {
		"home": 0,
		"away": 0
	}
}
```

### User

```json
{
	"id": "string",
	"email": "string",
	"name": "string",
	"role": "string"
}
```
