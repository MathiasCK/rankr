import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from '@polls';
import { PollsService } from '@polls/polls.service';

@Module({
  imports: [ConfigModule],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
