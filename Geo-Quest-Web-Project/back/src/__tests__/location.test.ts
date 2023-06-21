import { Endpoints } from "../constants/constants";
import { app } from "../app";
import request from "supertest";
import { CustomErrors } from "../util/codeError";

beforeEach(() => {
    jest.clearAllMocks();
});

describe(`POST ${Endpoints.addLocation} - Add location endpoint`, () => {
    it("Should create a new location", async () => {
        const result = await request(app)
            .post(Endpoints.addLocation)
            .send(
                {
                    questId: 1,
                    name: "Fountain",
                    description: "Angel s fountain",
                    latitude: 25.63,
                    longitude: 56.98
                }
            );
        expect(result.statusCode).toEqual(200);

        expect(JSON.parse(result.text).data.id).toBeDefined();
    });

    it("Should fail due to invalid arguments", async () => {
        const result = await request(app)
            .post(Endpoints.addLocation);
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe(CustomErrors.WRONG_ARGUMENTS);
    });

    it("Should fail if the latitude is invalid", async () => {
        const result = await request(app)
            .post(Endpoints.addLocation)
            .send({
                questId: 1,
                name: "Fountain",
                description: "Angel s fountain",
                latitude: 225.63,
                longitude: 56.98
            });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe("Validation error: Latitude is invalid");
    });

    it("Should fail if the longitude is invalid", async () => {
        const result = await request(app)
            .post(Endpoints.addLocation)
            .send({
                questId: 1,
                name: "Fountain",
                description: "Angel s fountain",
                latitude: 25.63,
                longitude: 256.98
            });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(400);
        expect(message).toBe("Validation error: Longitude is invalid");
    });

    it("Should fail due to invalid questId", async () => {
        const result = await request(app)
            .post(Endpoints.addLocation)
            .send({
                questId: 10000,
                name: "Fountain",
                description: "Angel s fountain",
                latitude: 25.63,
                longitude: 25.98
            });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("Quest does not exist");
    });
});

describe(`GET ${Endpoints.getLocations} - Get locations endpoint`, () => {
    it("Should get the locations associated to a quest (as the owner so it cntains the code)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocations}/1`)
            .send({
                userId: 1
            });
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.length).toBeGreaterThan(0);
        expect(Object.keys(JSON.parse(result.text).data[0].code)).toBeDefined();
        expect(Object.keys(JSON.parse(result.text).data[0]).length).toBe(7);
    });
    it("Should get the locations associated to a quest (not owner)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocations}/1`)
            .send({
                userId: 2
            });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("Quest does not exist");
    });
    it("Should get the locations associated to a quest (not owner and no param)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocations}/1`);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.length).toBeGreaterThan(0);
        expect(Object.keys(JSON.parse(result.text).data[0]).length).toBe(6);
    });
    it("Should fail due to invalid arguments", async () => {
        const result = await request(app)
            .get(Endpoints.getLocations);
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(404);
    });
    it("Should fail if the quest doesn't exist", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocations}/125`);
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("Quest does not exist");
    });
});

describe(`POST ${Endpoints.claimLocation} - Claim location endpoint`, () => {
    it("Should claim a new location", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 3,
                    code: '24545452361215412788'
                }
            );
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(200);
        expect(message).toBe("User claimed a new location");
    });

    it("Should not claim this location (user already claimed location)", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 3,
                    code: '24545452361215412788'
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe("Location has already been claimed");
    });

    it("Should not claim this location (quest is inactive)", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 3,
                    code: '478548754787545321584'
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe("Quest is inactive");
    });

    it("Should not claim this location (too late)", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 3,
                    code: '24545452361215412789'
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe("Quest is inactive");
    });

    it("Should not claim this location (owner)", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 1,
                    code: '24545452361215412788'
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe("Owner cannot claim his own Location");
    });

    it("Should not claim a new location (code does not exists)", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 3,
                    code: 'aaaa'
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe("Location or user does not exist");
    });

    it("Should not claim a new location (wrong arguments)", async () => {
        const result = await request(app)
            .post(Endpoints.claimLocation)
            .send(
                {
                    userId: 3,
                    location: 1
                }
            );
        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.text).message).toBe(CustomErrors.WRONG_ARGUMENTS);
    });
});

describe(`PUT ${Endpoints.editLocation} - Edit location endpoint`, () => {
    it("Should edit a location (owner)", async () => {
        const result = await request(app)
            .put(Endpoints.editLocation)
            .send(
                {
                    locationId: 7,
                    userId: 2,
                    name: "La pomme d'Einstein",
                    description: "Sous le pommier près de l'étang",
                    latitude: 12,
                    longitude: 12,
                    img: "image"
                }
            );
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.name).toBe("La pomme d'Einstein");
        expect(JSON.parse(result.text).data.description).toBe("Sous le pommier près de l'étang");
        expect(JSON.parse(result.text).data.latitude).toBe(12);
        expect(JSON.parse(result.text).data.longitude).toBe(12);
        expect(JSON.parse(result.text).data.img).toBe("image");
    });

    it("Should fail because user is not owner", async () => {
        const result = await request(app)
            .put(Endpoints.editLocation)
            .send(
                {
                    locationId: 4,
                    userId: 2,
                    name: "La pomme d'Einstein",
                    description: "Sous le pommier près de l'étang"
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe('User is not owner');
    });

    it("Should fail because quest is active", async () => {
        const result = await request(app)
            .put(Endpoints.editLocation)
            .send(
                {
                    locationId: 9,
                    userId: 1,
                    name: "Sous le pommier d'Einstein"
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe("Quest is active");
    });

    it("Should fail due to invalid id", async () => {
        const result = await request(app)
            .put(Endpoints.editLocation)
            .send(
                {
                    locationId: 150,
                    userId: 1,
                    name: "La pomme d'Einstein",
                    description: "Sous le pommier près de l'étang"
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe('Location does not exist');
    });
});

describe(`DELETE ${Endpoints.removeLocation} - Delete location endpoint`, () => {
    it("Should delete a location (owner)", async () => {
        const result = await request(app)
            .delete(Endpoints.removeLocation)
            .send(
                {
                    locationId: 7,
                    userId: 2
                }
            );
        expect(result.statusCode).toEqual(200);
    });

    it("Should fail because user is not owner", async () => {
        const result = await request(app)
            .delete(Endpoints.removeLocation)
            .send(
                {
                    locationId: 4,
                    userId: 2
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe('User is not owner');
    });

    it("Should fail because quest is active", async () => {
        const result = await request(app)
            .delete(Endpoints.removeLocation)
            .send(
                {
                    locationId: 9,
                    userId: 1
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe('Owner cannot delete this location');
    });

    it("Should fail due to invalid id", async () => {
        const result = await request(app)
            .delete(Endpoints.removeLocation)
            .send(
                {
                    locationId: 150,
                    userId: 1
                }
            );
        expect(result.statusCode).toEqual(403);
        expect(JSON.parse(result.text).message).toBe('Location does not exist');
    });
});