import { Endpoints } from "../constants/constants";
import { app } from "../app";
import request from "supertest";
import { CustomErrors } from "../util/codeError";

describe(`POST ${Endpoints.addQuest} - Add quest endpoint`, () => {
    it("Should create a new quest", async () => {
        const result = await request(app)
            .post(Endpoints.addQuest)
            .send(
                {
                    userId: 1,
                    name: "my_quest",
                    description: "description",
                }
            );
        expect(result.statusCode).toEqual(200);

        expect(JSON.parse(result.text).data.name).toEqual("my_quest");
    });
    it("Should fail due to invalid arguments", async () => {
        const result = await request(app)
            .post(Endpoints.addQuest);
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe(CustomErrors.WRONG_ARGUMENTS);
    });
    it("Should fail if the user doesn't exist", async () => {
        const result = await request(app)
            .post(Endpoints.addQuest)
            .send({
                userId: 999,
                name: "my_quest",
                description: "description",
            });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("User does not exist");
    });
});

describe(`GET ${Endpoints.getQuests} - Get quest endpoint`, () => {
    it("Should GET the quest", async () => {
        const result = await request(app)
            .post(Endpoints.getQuests)
            .send(
                {
                    codes: ["12345678901234567890123456789012"],
                }
            );
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data[0].name).toEqual("Paris tour");
    });
    it("Should fail due to invalid arguments", async () => {
        const result = await request(app)
            .post(Endpoints.getQuests)
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe(CustomErrors.WRONG_ARGUMENTS);
    });
});

describe(`PUT ${Endpoints.editQuest} - Edit quest endpoint`, () => {
    it("Should PUT the quest (owner)", async () => {
        const result = await request(app)
            .put(Endpoints.editQuest)
            .send(
                {
                    questId: 2,
                    userId: 1,
                    name: "Visit Paris",
                    description: "Near Paris",
                    active: true,
                    img: "image",
                    endDate: "2055-01-01"
                }
            );
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.name).toEqual("Visit Paris");
        expect(JSON.parse(result.text).data.description).toEqual("Near Paris");
        expect(JSON.parse(result.text).data.endDate).toEqual("2055-01-01T00:00:00.000Z");
        expect(JSON.parse(result.text).data.img).toEqual("image");
        expect(JSON.parse(result.text).data.active).toEqual(true);
    });
    it("Should fail because user is not owner", async () => {
        const result = await request(app)
            .put(Endpoints.editQuest)
            .send(
                {
                    questId: 1,
                    userId: 2,
                    name: "Visit Paris"
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toEqual("User is not owner");
    });
    it("Should fail due to invalid arguments", async () => {
        const result = await request(app)
            .put(Endpoints.editQuest);
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe(CustomErrors.WRONG_ARGUMENTS);
    });
    it("Should fail if the quest doesn't exist", async () => {
        const result = await request(app)
            .put(Endpoints.editQuest)
            .send(
                {
                    questId: 150,
                    userId: 2,
                    name: "Visit Paris"
                }
            );
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("Quest does not exist");
    });
});

describe(`DELETE ${Endpoints.deleteQuest} - Delete quest endpoint`, () => {
    it("Should DELETE the quest (owner)", async () => {
        const result = await request(app)
            .delete(Endpoints.deleteQuest)
            .send(
                {
                    questId: 1,
                    userId: 1
                }
            );
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).message).toEqual("Quest has been removed");
    });

    it("Should not DELETE the quest (not owner)", async () => {
        const result = await request(app)
            .delete(Endpoints.deleteQuest)
            .send(
                {
                    questId: 2,
                    userId: 3
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toEqual("User is not owner");
    });

    it("Should fail due to invalid arguments", async () => {
        const result = await request(app)
            .delete(Endpoints.deleteQuest)
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe(CustomErrors.WRONG_ARGUMENTS);
    });

    it("Should fail due to invalid questId", async () => {
        const result = await request(app)
            .delete(Endpoints.deleteQuest)
            .send(
                {
                    questId: 250,
                    userId: 3
                }
            );
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("Quest does not exist");
    });
});