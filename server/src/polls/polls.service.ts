import { Injectable, Logger } from '@nestjs/common';
import { createPollID, createUserID } from '@utils/ids';
import { CreatePollFields, JoinPollFields, RejoinPollFields } from '@polls';
import { PollsRepository } from '@polls/polls.repository';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(private readonly pollsRepository: PollsRepository) {}

  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    this.logger.debug(`Creating poll with pollID: ${pollID}`);

    return await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      userID,
    });
  }

  async joinPoll(fields: JoinPollFields) {
    const userID = createUserID();

    this.logger.debug(
      `Fetching poll with pollID: ${fields.pollID} for user with id: ${userID}`,
    );

    return await this.pollsRepository.getPoll(fields.pollID);
  }

  async rejoinPoll(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );
    return await this.pollsRepository.addParticipant(fields);
  }
}
