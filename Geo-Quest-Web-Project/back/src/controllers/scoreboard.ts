import { CodeError, CustomErrors } from "../util/codeError";
import has from "has-keys";
import httpStatus from "http-status";
import * as express from 'express';
import { UserModel } from "../models/user";
import { UserClaimModel } from "../models/userClaim";
import db from "../models/database"

export async function getScore(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Score']
    // #swagger.summary = 'Get score of a player'
    // #swagger.parameters['userId'] = { in: 'params', type: 'integer', description: 'The id of the user', required: true, schema: '10'}
    // #swagger.responses[200] = { description: 'OK. Return score', schema: { score : 2 } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId)' } 
    // #swagger.responses[403] = { description: 'The user does not exist'}
    if (!has(request.params, ['userId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId } = request.params;

    const user = await UserModel.findOne({ where: { id: userId } });
    if (user) {
        const score = (await UserClaimModel.findAll({ where: { userid: user.id } })).length;
        response.json({ status: true, message: '', data: { score } })
    }
    response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User does not exist' })
}

export async function getLocationHistory(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Score']
    // #swagger.summary = 'Returns last locations associated to a user'
    // #swagger.parameters['userId'] = { in: 'params', type: 'integer', description: 'The id of the user', required: true, schema: '10'}
    // #swagger.responses[200] = { description: 'OK. Return locations', schema: { data : { history : [ { locationId: 1, locationName: 'Arc de triomphe', claimDate: '2001-01-01T00:00:00.000Z', img: 'image_url' } ] } } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId)' } 
    // #swagger.responses[403] = { description: 'User does not exist'}
    if (!has(request.params, ['userId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId } = request.params;

    const user = await UserModel.findOne({ where: { id: userId } });
    if (user) {
        const history = (await db.query("SELECT l.id AS locationId, l.name AS locationName, u.date AS claimDate, l.img AS img FROM userClaims u LEFT JOIN locations l ON l.id = u.locationId WHERE u.userId = " + userId + " GROUP BY u.id ORDER BY date DESC"))[0]
        response.json({ status: true, message: '', data: { history } });
    }
    response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User does not exist' });
}

export async function getRank(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Score']
    // #swagger.summary = 'Returns rank of player'
    // #swagger.responses[200] = { description: 'OK. Return rank', schema: { data : { rank : 23 } } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId)' } 
    // #swagger.responses[403] = { description: 'The user does not exist'}
    if (!has(request.params, ['userId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId } = request.params;

    const user = await UserModel.findOne({ where: { id: userId } });
    if (user) {
        let rank = - 1;
        const ranking = (await db.query("SELECT COUNT(userClaims.userId) AS score, u.id AS id FROM users u LEFT JOIN userClaims ON u.id = userClaims.userId GROUP BY u.id ORDER BY score DESC"))[0]

        for (let i = 0; i < ranking.length; i++) {
            if (ranking[i].id == userId) {
                rank = i + 1;
            }
        }

        response.json({ status: true, message: '', data: { rank } });
    }
    response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User does not exist' })
}

export async function getRanking(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Score']
    // #swagger.summary = 'Returns the :limit: top players. Limit must be between 1 and 25'
    // #swagger.responses[200] = { description: 'OK. Return ranking', schema: { data : { ranking : [ { score: 21, username: "chad", id: 9 } ] } } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing limit)' } 
    if (!has(request.params, ['limit'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const limit = Math.max(Number(request.params.limit), 25);

    const ranking = (await db.query("SELECT COUNT(userClaims.userId) AS score, u.username, u.id FROM users u LEFT JOIN userClaims ON u.id = userClaims.userId GROUP BY u.username ORDER BY score DESC LIMIT " + limit))[0]

    response.json({ status: true, message: '', data: { ranking } });
}