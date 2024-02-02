import { Color } from './';

export interface ScoreboardTeam {
    name: string;
    logoId: string;
    score: number;
    timeoutsRemaining: number;
    hasUsedOfficialReview: boolean;
    hasRetainedOfficialReview: boolean;
    isLead: boolean;
    jammerId: string;
    color: Color;
}

;

