import { jwtModule, redisModule } from '@/modules.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from '@polls';
import { PollsService } from '@polls/polls.service';
import { PollsRepository } from '@polls/polls.repository';

@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository],
})
export class PollsModule {}
