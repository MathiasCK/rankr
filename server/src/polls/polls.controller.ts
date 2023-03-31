import { Controller, Post, Logger, Body } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';

@Controller('api/polls')
export class PollsController {
  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    return createPollDto;
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    return joinPollDto;
  }

  @Post('/rejoin')
  async rejoin() {
    Logger.log('Rejoin');
  }
}
