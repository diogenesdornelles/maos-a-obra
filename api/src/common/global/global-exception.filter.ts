import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'errors' in exceptionResponse
      ) {
        return response.status(status).json(exceptionResponse);
      }

      return response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const target = exception.meta?.target
        ? Array.isArray(exception.meta.target)
          ? exception.meta.target.join(', ')
          : // eslint-disable-next-line @typescript-eslint/no-base-to-string
            String(exception.meta.target)
        : 'desconhecido';

      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = `Já existe um registro com esses dados. Campo(s) afetado(s): ${target}`;
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = `Registro não encontrado. Campo(s): ${target}`;
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = `Violação de chave estrangeira. Campo(s): ${target}`;
          break;
        case 'P2014':
          status = HttpStatus.BAD_REQUEST;
          message = `Dados inválidos fornecidos. Campo(s): ${target}`;
          break;
        case 'P2028':
          status = HttpStatus.CONFLICT;
          message = 'Conflito de transação. Tente novamente.';
          break;
        case 'P1001':
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Erro de conexão com o banco de dados.';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Erro no banco de dados: ${exception.message}`;
          break;
      }

      return response.status(status).json({
        statusCode: status,
        message,
        error: `Código do erro: ${exception.code}`,
      });
    }

    console.error('Erro interno:', exception);

    return response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
