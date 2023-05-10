export type Participants = {
  [participantID: string]: string;
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminID: string;
  nominations: Nominations;
  rankings: Rankings;
  results: Results;
  hasStarted: boolean;
};

export type Rankings = {
  [userID: string]: NominationID[];
};

export type Result = {
  nominationID: NominationID;
  nominationText: string;
  score: number;
};

export type Results = Result[];

type NominationID = string;

export type Nomination = {
  userID: string;
  text: string;
};

export type Nominations = {
  [nominationID: NominationID]: Nomination;
};
