import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { inspect } from 'util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name, {
    timestamp: true,
  });
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    this.logger.error(`Exception`, inspect(exception, { depth: 4 }));
    this.logger.error(`Host`, inspect(host, { depth: 3 }));
    const ctx = host.switchToHttp();
    if (exception instanceof HttpException) {
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const resp = exception.getResponse();
      const respObj =
        typeof resp === 'object' && resp !== null ? resp : { message: resp };
      const responseBody = {
        ...respObj,
        timestamp: new Date().toISOString(),
        path: String(httpAdapter.getRequestUrl(ctx.getRequest())),
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaErrorsMap: Record<
        string,
        { statusCode: number; message: string }
      > = {
        P2000: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Valor fornecido é maior que o permitido.',
        },
        P2001: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Registro relacionado não encontrado.',
        },
        P2002: {
          statusCode: HttpStatus.CONFLICT,
          message: 'Registro já existe (constraint única violada).',
        },
        P2003: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Relacionamento inválido (foreign key).',
        },
        P2004: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Falha de constraint.',
        },
        P2005: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Valor inválido fornecido.',
        },
        P2006: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Valor inválido para o campo.',
        },
        P2007: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Dados inválidos segundo validações do Prisma.',
        },
        P2011: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Campo obrigatório está nulo.',
        },
        P2012: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Campo obrigatório não informado.',
        },
        P2025: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado.',
        },
      };

      const { statusCode, message } = prismaErrorsMap[exception.code] ?? {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro desconhecido no Prisma (código ${exception.code}).`,
      };

      const responseBody = {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: String(httpAdapter.getRequestUrl(ctx.getRequest())),
        details: {
          code: exception.code,
          meta: exception.meta ?? null,
        },
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
      return;
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      const responseBody = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Payload inválido para operação Prisma.',
        timestamp: new Date().toISOString(),
        path: String(httpAdapter.getRequestUrl(ctx.getRequest())),
        details: exception.message,
      };

      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.BAD_REQUEST,
      );
      return;
    }

    const responseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno no servidor.',
      error: 'Erro interno no servidor.',
      timestamp: new Date().toISOString(),
      path: String(httpAdapter.getRequestUrl(ctx.getRequest())),
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
