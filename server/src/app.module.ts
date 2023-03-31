import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsModule, PollsController } from './polls';

@Module({
  imports: [ConfigModule.forRoot(), PollsModule],
  controllers: [PollsController],
  providers: [],
})
export class AppModule {}
