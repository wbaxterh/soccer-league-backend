export interface Game {
	id: string;
	leagueId: string;
	homeTeamId: string;
	awayTeamId: string;
	date: string;
	score?: {
		home: number;
		away: number;
	};
}
