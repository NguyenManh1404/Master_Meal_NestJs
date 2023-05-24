import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import HttpRequestModel from '../../database/models/http-request.model';

const getResponseLog = (logger: Logger, res: Response, req: any) => {
  const rawResponse = res.write;
  const rawResponseEnd = res.end;
  const chunkBuffers = [];
  res.write = (...chunks) => {
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      resArgs[i] = chunks[i];
      if (!resArgs[i]) {
        res.once('drain', res.write);
        i--;
      }
    }
    if (resArgs[0]) {
      chunkBuffers.push(Buffer.from(resArgs[0]));
    }
    return rawResponse.apply(res, resArgs);
  };

  res.end = (...chunk) => {
    const resArgs = [];
    for (let i = 0; i < chunk.length; i++) {
      resArgs[i] = chunk[i];
    }
    if (resArgs[0]) {
      chunkBuffers.push(Buffer.from(resArgs[0]));
    }
    const body = Buffer.concat(chunkBuffers).toString('utf8');
    res.setHeader('origin', 'restjs-req-res-logging-repo');
    const responseLog = {
      response: {
        body: JSON.parse(body) || body || 'no body',
        // statusCode: res.statusCode,
        // headers: res.getHeaders(),
      },
    };
    logger.log(`HTTP Request Logging:`, {
      request: req,
      response: responseLog.response,
    });

    try {
      const httpRequest = new HttpRequestModel();
      httpRequest.method = req.method;
      httpRequest.url = req.originalUrl;
      httpRequest.request_ip = req.ip;
      httpRequest.request_body = JSON.stringify(req.body);
      httpRequest.response_status = req.statusCode;
      httpRequest.response_body = body;
      httpRequest.save().then();
    } catch (e) {
      console.log(e);
    }

    rawResponseEnd.apply(res, resArgs);
    return responseLog as unknown as Response;
  };
};

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  public use(request: Request, response: Response, next: NextFunction): void {
    const {ip, method} = request;
    const userAgent = request.get('user-agent') || '';
    const {statusCode} = response;
    getResponseLog(this.logger, response, {
      method,
      statusCode,
      user_agent: userAgent,
      ip,
      body: request.body,
      originalUrl: request.originalUrl,
      // headers: request.headers,
    });
    // const contentLength = response.get('content-length');
    // this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    // response.on('close', () => {
    //   console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Request:`, {
    //     path: url,
    //     headers: request.headers,
    //     body: request.body,
    //     originalUrl: request.originalUrl,
    //   });
    // });

    next();
  }
}
