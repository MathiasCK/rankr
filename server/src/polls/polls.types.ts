import { Request } from 'express';
import { Nomination } from 'shared';
import { Socket } from 'socket.io';

type poll_user_ID = {
  pollID: string;
  userID: string;
};

// Service types
export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollFields = {
  name: string;
} & poll_user_ID;

export type AddParticipantFields = {
  name: string;
} & poll_user_ID;

export type AddNominationFields = {
  text: string;
} & poll_user_ID;

export type SubmitRankingFields = {
  rankings: string[];
} & poll_user_ID;

// Repository types
export type CreatePollData = {
  topic: string;
  votesPerVoter: number;
} & poll_user_ID;

export type AddParticipantData = {
  name: string;
} & poll_user_ID;

export type AddNominationData = {
  pollID: string;
  nominationID: string;
  nomination: Nomination;
};

export type AddParticipantRankingsData = {
  rankings: string[];
} & poll_user_ID;

// Guard types
export type AuthPayload = {
  name: string;
} & poll_user_ID;

export type RequestWithAuth = Request & AuthPayload;

export type SocketWithAuth = Socket & AuthPayload;
