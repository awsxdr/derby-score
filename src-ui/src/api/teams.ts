import { Api } from './api';

export interface Team {
    id: string,
    name: string,
    logoId: string
};

export class Teams {
    async getTeams() {
        return (await Api.get<Team[]>('teams')).data;
    }

    async createTeam(teamName: string) {
        const teamId: string = (await Api.post('teams', { teamName })).data;

        return teamId;
    }
};