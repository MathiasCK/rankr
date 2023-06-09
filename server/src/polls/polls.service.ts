import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createPollID, createUserID, createNominationID } from '@utils/ids';
import {
  AddNominationFields,
  AddParticipantFields,
  CreatePollFields,
  JoinPollFields,
  RejoinPollFields,
  SubmitRankingFields,
} from '@polls';
import { PollsRepository } from '@polls/polls.repository';
import { JwtService } from '@nestjs/jwt';
import { Poll } from 'shared';
import getResults from '@utils/getResults';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService,
  ) {}

  genJWTAccesToken(pollID: string, name: string, subject: string) {
    return this.jwtService.sign(
      {
        pollID,
        name,
      },
      {
        subject,
      },
    );
  }

  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    this.logger.debug(`Creating poll with pollID: ${pollID}`);

    const createdPoll = await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      userID,
    });

    this.logger.debug(
      `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`,
    );

    return {
      poll: createdPoll,
      accessToken: this.genJWTAccesToken(createdPoll.id, fields.name, userID),
    };
  }

  async joinPoll(fields: JoinPollFields) {
    const userID = createUserID();

    this.logger.debug(
      `Fetching poll with pollID: ${fields.pollID} for user with id: ${userID}`,
    );

    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    return {
      poll: joinedPoll,
      accessToken: this.genJWTAccesToken(joinedPoll.id, fields.name, userID),
    };
  }

  async rejoinPoll(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );
    return await this.pollsRepository.addParticipant(fields);
  }

  async addParticipant(addParticipant: AddParticipantFields): Promise<Poll> {
    return this.pollsRepository.addParticipant(addParticipant);
  }

  async removeParticipant(
    pollID: string,
    userID: string,
  ): Promise<Poll | void> {
    const poll = await this.pollsRepository.getPoll(pollID);

    if (!poll.hasStarted) {
      return await this.pollsRepository.removeParticipant(pollID, userID);
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    return this.pollsRepository.getPoll(pollID);
  }

  async addNomination({
    pollID,
    userID,
    text,
  }: AddNominationFields): Promise<Poll> {
    return this.pollsRepository.addNomitation({
      pollID,
      nominationID: createNominationID(),
      nomination: {
        userID,
        text,
      },
    });
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    return this.pollsRepository.removeNomination(pollID, nominationID);
  }

  async startPoll(pollID: string): Promise<Poll> {
    return this.pollsRepository.startPoll(pollID);
  }

  async submitRankings(rankingsData: SubmitRankingFields): Promise<Poll> {
    const hasStarted = this.pollsRepository.getPoll(rankingsData.pollID);

    if (!hasStarted) {
      throw new BadRequestException(
        'Participants cannot rank until the poll has started',
      );
    }

    return this.pollsRepository.addParticipantRankings(rankingsData);
  }

  async computeResults(pollID: string): Promise<Poll> {
    const { rankings, nominations, votesPerVoter } = await this.getPoll(pollID);

    const results = getResults(rankings, nominations, votesPerVoter);

    return this.pollsRepository.addResults(pollID, results);
  }

  async cancelPoll(pollID: string): Promise<void> {
    return this.pollsRepository.deletePoll(pollID);
  }
}
