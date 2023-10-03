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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let extractedStatusCode: HttpStatus;
    let extractedMessage: string;

    if (exception instanceof HttpException) {
      const httpException = exception as HttpException;
      extractedStatusCode = httpException.getStatus();
      const httpErrorData = httpException.getResponse() as any;
      extractedMessage = httpErrorData?.message;
    }

    const statusCode = extractedStatusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = extractedMessage || exception.message;

    let completeExceptionMessage = message;

    if (request.body && Object.keys(request.body)?.length > 0) {
      completeExceptionMessage += ` --- Request Body: ${JSON.stringify(
        request.body,
      )}`;
    }
    exception.message = completeExceptionMessage;

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
