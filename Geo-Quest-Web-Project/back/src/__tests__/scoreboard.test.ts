import { Endpoints } from "../constants/constants";
import { app } from "../app";
import request from "supertest";
import { CustomErrors } from "../util/codeError";

beforeEach(() => {
    jest.clearAllMocks();
});

describe(`GET ${Endpoints.getLocationHistory} - Get location history endpoint`, () => {
    it("Should get location history (2 locations)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocationHistory}/2`);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.history.length).toBe(2);
        expect(JSON.parse(result.text).data.history[1].claimDate).toBe("2001-01-01 00:00:00.000 +00:00");
    });

    it("Should get location history (0 location)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocationHistory}/1`);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.history.length).toBe(0);
    });

    it("Should not get location history", async () => {
        const result = await request(app)
            .get(`${Endpoints.getLocationHistory}`);

        expect(result.statusCode).toEqual(404);
    });
});

describe(`GET ${Endpoints.getScore} - Get score endpoint`, () => {
    it("Should get user score (2)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getScore}/2`);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.score).toBe(2);
    });

    it("Should get user score (0)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getScore}/1`);
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.score).toBe(0);
    });

    it("Should not get user score", async () => {
        const result = await request(app)
            .get(`${Endpoints.getScore}`);

        expect(result.statusCode).toEqual(404);
    });
});

describe(`GET ${Endpoints.getRank} - Get rank endpoint`, () => {
    it("Should get rank of user (rank 1)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getRank}/2`);

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.rank).toBe(1);
    });
    it("Should get rank of user (rank > 1)", async () => {
        const result = await request(app)
            .get(`${Endpoints.getRank}/1`);

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.rank).toBeGreaterThan(1);
    });
    it("Should not get rank", async () => {
        const result = await request(app)
            .get(`${Endpoints.getRank}`);

        expect(result.statusCode).toEqual(404);
    });
});

describe(`GET ${Endpoints.getRanking} - Get ranking endpoint`, () => {
    it("Should get ranking", async () => {
        const result = await request(app)
            .get(`${Endpoints.getRanking}/5`);

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.text).data.ranking.length).toBeGreaterThan(0);
    });

    it("Should not get ranking", async () => {
        const result = await request(app)
            .get(`${Endpoints.getRanking}`);

        expect(result.statusCode).toEqual(404);
    });
});


