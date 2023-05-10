import { IO_REDIS_KEY } from '@/redis.module';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import {
  AddNominationData,
  AddParticipantData,
  AddParticipantRankingsData,
  CreatePollData,
} from '@polls';
import { Poll, Results } from 'shared';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IO_REDIS_KEY) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    userID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      participants: {},
      adminID: userID,
      hasStarted: false,
      nominations: {},
      rankings: {},
      results: [],
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll, null, 2)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with id: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );
      this.logger.verbose(currentPoll);
      return JSON.parse(currentPoll);
    } catch (e) {
      const msg = `Failed to get pollID ${pollID}`;

      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
  }

  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name ${userID}/${name} to pollID: ${pollID}`,
    );
    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      return this.getPoll(pollID);
    } catch (e) {
      const msg = `Failed to add a participant with userID/name ${userID}/${name} to pollID: ${pollID}`;

      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
  }

  async removeParticipant(pollID: string, userID: string): Promise<Poll> {
    this.logger.log(`Removing userID: ${userID} from poll ${pollID}`);

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key, participantPath);
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to remove userID: ${userID} from poll: ${pollID}`,
        e,
      );
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async addNomitation({
    pollID,
    nominationID,
    nomination,
  }: AddNominationData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a nomination with nomitationID/text: ${nominationID}/${nomination.text} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );

      return this.getPoll(pollID);
    } catch (e) {
      const msg = `Failed to add a nomination with nomitationID/text: ${nominationID}/${nomination.text} to pollID: ${pollID}`;

      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    this.logger.log(
      `Attempting to remove nominationID: ${nominationID} from pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key, nominationPath);

      return this.getPoll(pollID);
    } catch (e) {
      const msg = `Failed to remove nominationID: ${nominationID} from pollID: ${pollID}`;

      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
  }

  async startPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Setting hasStarted for poll: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        '.hasStarted',
        JSON.stringify(true),
      );

      return this.getPoll(pollID);
    } catch (e) {
      const msg = `Failed to set hasStarted for poll: ${pollID}`;

      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
  }

  async addParticipantRankings({
    pollID,
    userID,
    rankings,
  }: AddParticipantRankingsData): Promise<Poll> {
    this.logger.log(
      `Attempting to add rankings for userID/name: ${userID} to pollID: ${pollID}`,
      rankings,
    );

    const key = `polls:${pollID}`;
    const rankingsPath = `.rankings.${userID}`;
    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        rankingsPath,
        JSON.stringify(rankings),
      );

      return this.getPoll(pollID);
    } catch (e) {
      const msg = `Failed to add rankings for userID/name: ${userID} to pollID: ${pollID}`;

      this.logger.error(msg, rankings);
      throw new InternalServerErrorException(msg);
    }
  }

  async addResults(pollID: string, results: Results): Promise<Poll> {
    this.logger.log(
      `Attempting to add results to pollID: ${pollID}`,
      JSON.stringify(results),
    );

    const key = `polls:${pollID}`;
    const resultsPath = `.results`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        resultsPath,
        JSON.stringify(results),
      );

      return this.getPoll(pollID);
    } catch (e) {
      const msg = `Failed to add results to pollID: ${pollID}`;

      this.logger.error(msg, JSON.stringify(results));
      throw new InternalServerErrorException(msg);
    }
  }

  async deletePoll(pollID: string): Promise<void> {
    this.logger.log(`Attempting to delete poll: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key);
    } catch (e) {
      const msg = `Failed to delete poll: ${pollID}`;

      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }
  }
}
