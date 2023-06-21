import { CodeError, CustomErrors } from "../util/codeError";
import has from "has-keys";
import httpStatus from "http-status";
import * as express from 'express';
import { QuestModel } from "../models/quest";
import { LocationModel } from "../models/location";
import { UserClaimModel } from "../models/userClaim";
import { genId } from "../util/appUtils";
import { UserModel } from "../models/user";

export async function createLocation(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Location']
    // #swagger.summary = 'Create a location associated to a quest'
    // #swagger.parameters['questId'] = { in: 'body', type: 'integer', description: 'The id of the quest', required: true, schema: '1'}
    // #swagger.parameters['name'] = { in: 'body', type: 'string', description: 'The name of the location', required: true, schema: 'Fountain'}
    // #swagger.parameters['description'] = { in: 'body', type: 'string', description: 'The description of the location', required: true, schema: 'Angel s Fountain'}
    // #swagger.parameters['latitude'] = { in: 'body', type: 'number', description: 'The latitude of the location', required: true, schema: '25.63'}
    // #swagger.parameters['longitude'] = { in: 'body', type: 'number', description: 'The longitude of the location', required: true, schema: '59.12'}
    // #swagger.responses[200] = { description: 'OK. Return the location', schema: { $ref: "#/definitions/Location" } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing questId, name, description, longitude or latitude)' } 
    // #swagger.responses[403] = { description: 'The quest does not exist'}
    if (!has(request.body, ['questId', 'name', 'description', 'latitude', 'longitude'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { questId, name, description, latitude, longitude } = request.body;

    const quest = await QuestModel.findOne({ where: { id: questId } });
    if (quest) {
        let location;
        let code = genId(16) + "-" + genId(16);

        while (await LocationModel.findOne({ where: { code: code } })) {
            code = genId(16) + "-" + genId(16);
        }

        await LocationModel.create({
            name: name,
            description: description,
            latitude: latitude,
            longitude: longitude,
            questId: questId,
            code: code
        }).then(async (l: any) => location = l);
        response.json({ status: true, message: '', data: location })
    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Quest does not exist' })
}

export async function getLocations(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Location']
    // #swagger.summary = 'Returns the locations associated to a quest'
    // #swagger.parameters['questId'] = { in: 'path', type: 'integer', description: 'The id of the quest', required: true, schema: '1'}
    // #swagger.parameters['userId'] = { in: 'path', type: 'integer', description: 'The id of the user, if referenced it also return the location codes', required: false, schema: '1'}
    // #swagger.responses[200] = { description: 'OK. Return the locations', schema: [ { $ref: "#/definitions/Location" } ] }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing questId)' }
    // #swagger.responses[403] = { description: 'The quest or user does not exist'}
    if (!has(request.params, ['questId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { questId } = request.params;
    let user = undefined;
    if (has(request.body, ['userId'])) {
        user = await UserModel.findOne({ where: { id: request.body.userId } });
        if (!user) response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User does not exist' })
    }

    const quest = await QuestModel.findOne({ where: (user ? { id: questId, creatorId: user.id } : { id: questId }) });
    console.log("quest: ", quest)

    if (quest) {
        let attributes = ["description", 'img', 'latitude', 'longitude', 'name', 'id']
        if (user) attributes.push('code');

        const locations = await LocationModel.findAll({ attributes, where: { questId: quest.id } }).map(location => location.dataValues);
        response.json({ status: true, message: '', data: locations })
    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Quest does not exist' })
}

export async function claimLocation(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Location']
    // #swagger.summary = 'Claim a location'
    // #swagger.parameters['userId'] = { in: 'body', type: 'integer', description: 'The id of the user', required: true, schema: '1'}
    // #swagger.parameters['code'] = { in: 'body', type: 'string', description: 'The code of the location', required: true, schema: '5912'}
    // #swagger.responses[200] = { description: 'OK. Claim location' }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId or code)' }
    // #swagger.responses[403] = { description: 'The user, quest, location does not exist, the quest is inactive, the location is already claimed or the owner cannot claim his location'}
    if (!has(request.body, ['userId', 'code'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId, code } = request.body;

    const location = await LocationModel.findOne({ where: { code: code } });
    const user = await UserModel.findOne({ where: { id: userId } });

    if (location && user) {
        const quest = await QuestModel.findOne({ where: { id: location.questId } });

        // if owner
        if (quest.creatorId == userId) {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Owner cannot claim his own Location' })

            // if inactive
        } else if (quest.active == false || (quest.endDate != null && quest.endDate < Date.now())) {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Quest is inactive' })

            // if already claimed
        } else if (await UserClaimModel.findOne({ where: { userId: userId, locationId: location.id } })) {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Location has already been claimed' })

        } else {
            const userclaim = await UserClaimModel.create({
                userId: user.id,
                locationId: location.id
            });
            response.json({ status: true, message: 'User claimed a new location' })
        }
    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Location or user does not exist' })
}

export async function removeLocation(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Location']
    // #swagger.summary = 'Remove a location'
    // #swagger.parameters['locationId'] = { in: 'body', type: 'integer', description: 'The id of the location', required: true, schema: '3'}
    // #swagger.parameters['userId'] = { in: 'body', type: 'integer', description: 'The id of the user', required: true, schema: '10'}
    // #swagger.responses[200] = { description: 'OK. Remove the location', schema: { message: 'Location has been deleted' } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing locationId or userId)' }
    // #swagger.responses[403] = { description: 'The location or user does not exist, the user is not the owner of the quest or the quest is active'}
    if (!has(request.body, ['locationId', 'userId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { locationId, userId } = request.body;

    const location = await LocationModel.findOne({ where: { id: locationId } });

    if (location) {
        // if owner
        const quest = await QuestModel.findOne({ where: { creatorId: userId, id: location.questId } });
        // si active
        if (quest && quest.active == true) {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Owner cannot delete this location' })

            // si non active mais owner
        } else if (quest) {
            await LocationModel.destroy({ where: { id: locationId } });
            response.json({ status: true, message: 'Location has been deleted' });

        } else {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User is not owner' })
        }
    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Location does not exist' })
}

export async function editLocation(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Location']
    // #swagger.summary = 'Return the locations associated to a quest'
    // #swagger.parameters['locationId'] = { in: 'body', type: 'integer', description: 'The id of the location', required: true, schema: '1'}
    // #swagger.parameters['userId'] = { in: 'body', type: 'integer', description: 'The id of the user', required: true, schema: '1'}
    // #swagger.parameters['description'] = { in: 'body', type: 'string', description: 'The description of the location', required: false, schema: 'This is a new description'}
    // #swagger.parameters['latitude'] = { in: 'body', type: 'string', description: 'The latitude of the location', required: false, schema: '12.1234'}
    // #swagger.parameters['longitude'] = { in: 'body', type: 'string', description: 'The longitude of the location', required: false, schema: '17.1234'}
    // #swagger.parameters['name'] = { in: 'body', type: 'string', description: 'The name of the location', required: false, schema: 'New name'}
    // #swagger.parameters['img'] = { in: 'body', type: 'string', description: 'The img of the location', required: false, schema: 'image_url'}
    // #swagger.responses[200] = { description: 'OK', schema: { $ref: "#/definitions/Location" } }
    // #swagger.responses[400] = { description: 'Invalid arguments' }
    // #swagger.responses[403] = { description: 'The location/user does not exist, the user is not the owner of the quest or the quest is already active'}
    if (!has(request.body, ['locationId', 'userId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { locationId, userId } = request.body;

    const location = await LocationModel.findOne({ where: { id: locationId } });

    if (location) {
        // if owner
        const quest = await QuestModel.findOne({ where: { creatorId: userId, id: location.questId } });
        // si draft
        if (quest && quest.active == false) {
            if (has(request.body, ['description'])) {
                location.description = request.body.description;
            }
            if (has(request.body, ['name'])) {
                location.name = request.body.name;
            }
            if (has(request.body, ['latitude'])) {
                location.latitude = request.body.latitude;
            }
            if (has(request.body, ['longitude'])) {
                location.longitude = request.body.longitude;
            }
            if (has(request.body, ['img'])) {
                location.img = request.body.img;
            }
            await location.save();
            response.json({ status: true, message: '', data: location });

            // active
        } else if (quest) {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Quest is active' })
        } else {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User is not owner' })
        }
    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Location does not exist' })
}