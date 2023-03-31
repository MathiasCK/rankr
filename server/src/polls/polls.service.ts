import { Injectable, Logger } from '@nestjs/common';
import { createPollID, createUserID } from '@utils/ids';
import { CreatePollFields, JoinPollFields, RejoinPollFields } from '@polls';
import { PollsRepository } from '@polls/polls.repository';
import { JwtService } from '@nestjs/jwt';

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
}
