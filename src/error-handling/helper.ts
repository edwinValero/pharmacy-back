import { HttpException, HttpStatus } from '@nestjs/common';

export function throwErrorsWithUniqueConstraints(
  error: any,
  repositoryName: string,
) {
  if (error.routine === '_bt_check_unique') {
    throw new HttpException(
      `Error: bad arguments, ${error.detail}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  throw new HttpException(
    `Error while creating a (${repositoryName}) with error: ${error}`,
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
