import { jwtModule, redisModule } from '@/modules.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from '@polls';
import { PollsService } from '@polls/polls.service';
import { PollsRepository } from '@polls/polls.repository';
import { PollsGateway } from '@polls/polls.gateway';

@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository, PollsGateway],
})
export class PollsModule {}
