import { MatchDayMatchPlayer } from './match';
import { MatchDayPersonPartial } from './person';

export type MatchDayMatchPlayerSpeedTest = {
    person: MatchDayPersonPartial;
    speedTest1: boolean | null;
    speedTest2: boolean | null;
    speedTest3: boolean | null;
    speedTestPost1: boolean | null;
    speedTestPost2: boolean | null;
};

export type MatchDayMatchReportScores = {
    fairPlay: number;
    refereeScore: number;
    playerOfTheMatch: MatchDayMatchPlayer;
};

export type MatchDayMatchReportTeam = {
    speedTests: MatchDayMatchPlayerSpeedTest[];
    scores: MatchDayMatchReportScores;
    coachSignature: string;
};

export type MatchDayMatchReport = {
    homeTeam: MatchDayMatchReportTeam;
    awayTeam: MatchDayMatchReportTeam;
    officialSignature: string;
};

export type MatchDayMatchSheetReturn = {
    ok: boolean;
    url: string;
};
