import { Api } from './api';

export interface Game {
    id: string;
    isActive: boolean;
    startTick: number;
    currentTick: number;
}

export class CreateGameRequest {
    homeTeam: string;
    awayTeam: string;

    constructor(homeTeam: string, awayTeam: string) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
    }
}

interface CreateGameResponse {
    gameId: string;
}

export class Games
{
    async getGames() {
        return (await Api.get<Game[]>('games')).data;
    }

    async getGame(gameId: string) {
        return (await Api.get<Game>(`games/${gameId}`)).data;
    }

    async createGame(game: CreateGameRequest) {
        const response: CreateGameResponse = (await Api.post('games', game)).data;

        return response.gameId;
    }
}