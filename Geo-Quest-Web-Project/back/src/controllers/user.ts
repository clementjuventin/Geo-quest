import { CodeError, CustomErrors } from "../util/codeError";
import has from "has-keys";
import httpStatus from "http-status";
import * as express from 'express';
import bcrypt from "bcrypt";
import jws from "jws";
import { UserModel } from "../models/user";
import env from "mandatoryenv";

env.load([
    'TOKENSECRET',
]);
const { TOKENSECRET } = process.env;

export async function signIn(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['User']
    // #swagger.summary = 'Verify credentials of user using the username and password. Return a token'
    // #swagger.parameters['username'] = { in: 'body', type: 'string', description: 'The username of the user', required: true, schema: 'chad'}
    // #swagger.parameters['password'] = { in: 'body', type: 'string', description: 'The password of the user', required: true, schema: 'not_hashed_pass'}
    // #swagger.responses[200] = { description: 'Sign in succeed', schema: { $ref: "#/definitions/User" } }
    // #swagger.responses[400] = { description: 'Wrong arguments (missing username or password)' } 
    // #swagger.responses[403] = { description: 'Invalid username or password' }
    if (!has(request.body, ['username', 'password'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { username, password } = request.body;

    const user = await UserModel.findOne({ where: { username } });
    if (user) {
        if (await bcrypt.compare(password, user.passhash)) {
            const token = jws.sign({ header: { alg: 'HS256' }, payload: username, secret: TOKENSECRET })
            const responseData = {
                id: user.id,
                username: username,
                creationDate: user.creationDate,
                token: token,
            }
            response.json({ status: true, message: '', data: responseData })
            return
        }
    }
    response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Sign in failed' })
}

export async function signUp(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['User']
    // #swagger.summary = 'Create a new user. Return a token'
    // #swagger.parameters['username'] = { in: 'body', type: 'string', description: 'The username of the user', required: true, schema: 'chad'}
    // #swagger.parameters['password'] = { in: 'body', type: 'string', description: 'The password of the user', required: true, schema: 'not_hashed_pass'}
    // #swagger.responses[200] = { description: 'Sign up succeed', schema: { $ref: "#/definitions/User" } }
    // #swagger.responses[400] = { description: 'Wrong arguments (missing username or password)' } 
    // #swagger.responses[403] = { description: 'Username already taken' }
    if (!has(request.body, ['username', 'password'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { username, password } = request.body;

    const user = await UserModel.findAll({ where: { username } });
    if (user.length !== 0) {
        response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Username already taken' })
    }
    const hashed = await bcrypt.hash(password, 10);
    let newUser;
    await UserModel.create({
        username: username, password: hashed
    }).then((u: any) => newUser = u)
    const token = jws.sign({ header: { alg: 'HS256' }, payload: username, secret: TOKENSECRET })
    const responseData = {
        id: newUser.id,
        username: username,
        creationDate: newUser.creationDate,
        token: token,
    }
    response.json({ status: true, message: '', data: responseData })
}