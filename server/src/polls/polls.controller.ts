import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from '@polls';
import { PollsService } from '@polls/polls.service';
import { ControllerAuthGuard } from './controller-auth.guard';
import { RequestWithAuth } from './polls.types';

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

  @UseGuards(ControllerAuthGuard)
  @Post('/rejoin')
  async rejoin(@Req() request: RequestWithAuth) {
    return await this.pollsService.rejoinPoll({
      name: request.name,
      pollID: request.pollID,
      userID: request.userID,
    });
  }
}
