import { SocketWithAuth } from '@polls';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import {
  WsBadRequestException,
  WsTypeException,
  WsUnknownException,
} from '@exceptions';

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();

      const wsException = new WsBadRequestException(
        exceptionData['message'] ?? exceptionData ?? exception.name,
      );
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof WsTypeException) {
      socket.emit('exception', exception.getError());
      return;
    }

    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
