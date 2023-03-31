import { Body, Controller, Post } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from '@polls';
import { PollsService } from '@polls/polls.service';

@Controller('api/polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    return await this.pollsService.createPoll(createPollDto);
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    return await this.pollsService.joinPoll(joinPollDto);
  }

  @Post('/rejoin')
  async rejoin() {
    return await this.pollsService.rejoinPoll({
      name: 'From token',
      pollID: 'Also from token',
      userID: 'Guess where this comes from?',
    });
  }
}
