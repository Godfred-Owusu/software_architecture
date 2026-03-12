import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = this.getHttpStatus(exception.code);

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getHttpStatus(code: string): number {
    const statusMap: Record<string, number> = {
      USER_CANNOT_CREATE_POST: 403,
      USER_CANNOT_UPDATE_POST: 403,
      USER_CANNOT_DELETE_POST: 403,
      POST_ALREADY_PUBLISHED: 400,
      USER_CANNOT_MANAGE_TAGS: 403,
      INVALID_TITLE: 400,
      INVALID_CONTENT: 400,
      POST_NOT_FOUND: 404,
      TAG_NOT_FOUND: 404,
      TAG_ALREADY_EXISTS: 409,
      TAG_ALREADY_ATTACHED: 409,
      SLUG_ALREADY_EXISTS: 409,
      USER_CANNOT_VIEW_POST: 403,
      POST_NOT_ACCEPTED: 403,
      USER_NOT_FOUND: 404,
      COMMENT_NOT_FOUND: 404,
      NOT_COMMENT_AUTHOR: 403,
      CANNOT_DELETE_COMMENT: 403,
    };
    return statusMap[code] || 400;
  }
}
