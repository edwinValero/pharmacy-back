import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    Logger.error(exception.stack);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let exceptionStatusCode: HttpStatus;
    let exceptionMessage: string;

    if (exception instanceof HttpException) {
      const httpException = exception as HttpException;
      exceptionStatusCode = httpException.getStatus();
      const httpErrorData = httpException.getResponse() as any;
      exceptionMessage = httpErrorData?.message;
    }

    const statusCode = exceptionStatusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exceptionMessage || exception.message;
    let finalMessage = message;

    if (request.body && Object.keys(request.body)?.length > 0) {
      finalMessage += ` ---> request payload: ${JSON.stringify(request.body)}`;
    }
    exception.message = finalMessage;

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
