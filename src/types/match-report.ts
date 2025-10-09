import { MatchPlayer } from './match';
import { MatchDayPersonPartial } from './person';

export type MatchPlayerSpeedTest = {
    person: MatchDayPersonPartial;
    speedTest1: boolean | null;
    speedTest2: boolean | null;
    speedTest3: boolean | null;
    speedTestPost1: boolean | null;
    speedTestPost2: boolean | null;
};

export type MatchReportScores = {
    fairPlay: number;
    refereeScore: number;
    playerOfTheMatch: MatchPlayer;
};

export type MatchReportTeam = {
    speedTests: MatchPlayerSpeedTest[];
    scores: MatchReportScores;
    coachSignature: string;
};

export type MatchReport = {
    homeTeam: MatchReportTeam;
    awayTeam: MatchReportTeam;
    officialSignature: string;
};

export type MatchSheetReturn = {
    ok: boolean;
    url: string;
};
