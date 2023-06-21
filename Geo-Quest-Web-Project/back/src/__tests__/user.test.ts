import { Endpoints } from "../constants/constants";
import { app } from "../app";
import request from "supertest";
import { CustomErrors } from "../util/codeError";

describe(`POST ${Endpoints.signIn} - Sign In endpoint`, () => {
    it("Should not accept the request", async () => {
        const result = await request(app)
            .post(Endpoints.signIn);
        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.text).message).toEqual(CustomErrors.WRONG_ARGUMENTS);
    });
    it("Should not return a token when the wrong password is provided", async () => {
        const result = await request(app)
            .post(Endpoints.signIn)
            .send({ username: "cle", password: "wrong_password" });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe("Sign in failed");
    });
    it("Should return a token after login", async () => {
        const result = await request(app)
            .post(Endpoints.signIn)
            .send({ username: "cle", password: "test" });
        const token = JSON.parse(result.text).data.token;
        expect(result.statusCode).toEqual(200);
        //expect(token).toBeDefined();
    });
});
describe(`POST ${Endpoints.signUp} - Sign Up endpoint`, () => {
    it("Should not accept the request", async () => {
        const result = await request(app)
            .post(Endpoints.signUp);
        expect(result.statusCode).toEqual(400);
        expect(JSON.parse(result.text).message).toEqual(CustomErrors.WRONG_ARGUMENTS);
    });
    it("Should not return a token if username is already taken", async () => {
        const result = await request(app)
            .post(Endpoints.signUp)
            .send({ username: "cle", password: "123" });
        const message = JSON.parse(result.text).message;
        expect(result.statusCode).toEqual(403);
        expect(message).toBe('Username already taken');
    });
    it("Should return a token after signing up", async () => {
        const result = await request(app)
            .post(Endpoints.signUp)
            .send({ username: "clement", password: "test" });
        const token = JSON.parse(result.text).data.token;
        expect(result.statusCode).toEqual(200);
        //expect(token).toBeDefined();
    });
});