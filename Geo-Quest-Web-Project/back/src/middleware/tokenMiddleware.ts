import * as express from 'express';

export function tokenMiddleware(request: express.Request, response: express.Response, next) {
    console.log("this is the token middleware")
    console.log(`${request.method} ${request.path}`);
    next();
}