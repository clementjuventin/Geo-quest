import { CodeError, CustomErrors } from "../util/codeError";
import has from "has-keys";
import httpStatus from "http-status";
import * as express from 'express';
import { UserModel } from "../models/user";
import { QuestModel } from "../models/quest";
import { genId } from "../util/appUtils";

export async function createQuest(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Quest']
    // #swagger.summary = 'Create a new quest'
    // #swagger.parameters['userId'] = { in: 'body', type: 'integer', description: 'The id of the user', required: true, schema: '1'}
    // #swagger.parameters['name'] = { in: 'body', type: 'string', description: 'The name of the quest', required: true, schema: 'My quest'}
    // #swagger.parameters['description'] = { in: 'body', type: 'string', description: 'The description of the quest', required: true, schema: 'This is my first quest'}
    // #swagger.parameters['enddate'] = { in: 'body', type: 'integer', description: 'The end date of the quest', required: false, schema: '1680021654'}
    // #swagger.responses[200] = { description: 'OK. Return the created quest', schema: { data : { id: 6, code: "TfcYFJfEgeGrn2dne4wI1onULOkERFfJ", name: "My quest", description: "This is my first quest", active: false, img: "https://image.png", endDate: "1680021654" } } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId, name or description)' } 
    // #swagger.responses[403] = { description: 'User does not exist'}
    if (!has(request.body, ['userId', 'name', 'description'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId, name, description } = request.body;
    const enddate = request.body.enddate || undefined;

    const user = await UserModel.findOne({ where: { id: userId } });
    console.log(user)
    if (user) {
        let quest;
        await QuestModel.create({
            name: name,
            description: description,
            enddate: enddate,
            creatorId: user.id,
            code: genId(32)
        }).then((q: any) => quest = q)
        response.json({ status: true, message: '', data: quest })
    }
    else {
        response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User does not exist' })
    }
}

export async function getQuests(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Quest']
    // #swagger.summary = 'Get some quests by their codes. If some codes are invalid, they are ignored'
    // #swagger.parameters['codes'] = { in: 'body', description: 'Codes of quests', schema: ['12345678901234567890123456789012', '12345678901234567890123456789013'] }
    // #swagger.responses[200] = { description: 'OK. Return the quests', schema: { data : [ {$ref: "#/definitions/Quest" } ] } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing codes)' } 
    if (!has(request.body, ['codes'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { codes } = request.body;

    const quests = await QuestModel.findAll({ where: { code: codes } });
    response.json({ status: true, message: '', data: quests })
}

export async function editQuest(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Quest']
    // #swagger.summary = 'Edit a quest'
    // #swagger.parameters['userId'] = { in: 'body', type: 'integer', description: 'The id of the user', required: true, schema: '3'}
    // #swagger.parameters['questId'] = { in: 'body', type: 'integer', description: 'The id of the quest', required: true, schema: '1'}
    // #swagger.parameters['name'] = { in: 'body', type: 'string', description: 'The name of the quest', required: false, schema: 'My quest'}
    // #swagger.parameters['description'] = { in: 'body', type: 'string', description: 'The description of the quest', required: false, schema: 'This is my first quest'}
    // #swagger.parameters['active'] = { in: 'body', type: 'boolean', description: 'The active state of the quest', required: false, schema: 'true'}
    // #swagger.parameters['img'] = { in: 'body', type: 'string', description: 'The image of the quest', required: false, schema: 'https://image.png'}
    // #swagger.parameters['enddate'] = { in: 'body', type: 'integer', description: 'The end date of the quest', required: false, schema: '1680021654'}
    // #swagger.responses[200] = { description: 'OK. Return the updated quest', schema: { data : { $ref: "#/definitions/Quest" } } }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId or questId)' } 
    // #swagger.responses[403] = { description: 'User is not the owner or the quest does not exist'}
    if (!has(request.body, ['userId', 'questId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId, questId } = request.body;

    const quest = await QuestModel.findOne({ where: { id: questId } });
    if (quest) {
        // if owner
        if (quest.creatorId == userId) {

            if (has(request.body, ['name'])) {
                quest.name = request.body.name;
            }
            if (has(request.body, ['description'])) {
                quest.description = request.body.description;
            }
            if (has(request.body, ['active'])) {
                quest.active = request.body.active;
            }
            if (has(request.body, ['img'])) {
                quest.img = request.body.img;
            }
            if (has(request.body, ['endDate'])) {
                quest.endDate = request.body.endDate;
            }

            await quest.save();
            response.json({ status: true, message: '', data: quest });
        } else {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User is not owner' })
        }
    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Quest does not exist' })
}

export async function deleteQuest(request: express.Request, response: express.Response): Promise<void> {
    // #swagger.tags = ['Quest']
    // #swagger.summary = 'Delete a quest
    // #swagger.parameters['userId'] = { in: 'body', type: 'integer', description: 'The id of the user', required: true, schema: '3'}
    // #swagger.parameters['questId'] = { in: 'body', type: 'integer', description: 'The id of the quest', required: true, schema: '1'}
    // #swagger.responses[200] = { description: 'OK' }
    // #swagger.responses[400] = { description: 'Invalid arguments (missing userId or questId)' } 
    // #swagger.responses[403] = { description: 'User is not the owner or the quest does not exist'}
    if (!has(request.body, ['userId', 'questId'])) throw new CodeError(CustomErrors.WRONG_ARGUMENTS, httpStatus.BAD_REQUEST);
    const { userId, questId } = request.body;

    const quest = await QuestModel.findOne({ where: { id: questId } });
    if (quest) {
        // if owner
        if (quest.creatorId == userId) {
            quest.active = true;

            await quest.save();
            response.json({ status: true, message: "Quest has been removed" });

        } else {
            response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'User is not owner' })
        }

    }
    else response.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Quest does not exist' })
}