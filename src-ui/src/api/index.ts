import { ControlPanels } from './controlPanel';
import { Events } from './events';
import { Games } from './games';
import { Scoreboards } from './scoreboard';
import { Teams } from './teams';
import { Logos } from './logos';

export { JamStarted, ScoreIncremented, TeamType } from './events';
export type { ControlPanelState } from './controlPanel';
export type { Event } from './events';
export type { Game } from './games';
export { CreateGameRequest } from './games';
export type { ScoreboardState } from './scoreboard';
export type { Team } from './teams';

export default class Api {
    static readonly ControlPanels = new ControlPanels();
    static readonly Games = new Games();
    static readonly Scoreboards = new Scoreboards();
    static readonly Teams = new Teams();
    static readonly Events = new Events();
    static readonly Logos = new Logos();
};