import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: "0.1.0",
        title: "GeoQuest API",
        description: "This is the wonderfull <b>GeoQuest</b> API."
    },
    host: "geoquest.osc-fr1.scalingo.io",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Manage the user login and registration."
        },
        {
            "name": "Quest",
            "description": "Manage the quest objects."
        },
        {
            "name": "Location",
            "description": "Manage the location objects."
        },
        {
            "name": "Score",
            "description": "Get the game related date."
        }
    ],
    definitions: {
        User: {
            id: 2,
            username: 'user_name',
            creationDate: '2001-01-01T00:00:00.000Z',
            token: 'user_token'
        },
        Quest: {
            id: 1,
            code: "TfcYFJfEgeGrn2dne4wI1onULOkERFfJ",
            name: "My quest",
            description: "This is my first quest",
            active: true,
            img: "image_url",
            endDate: "1680021654"
        },
        Location: {
            id: 1,
            name: "My location",
            description: "My location description",
            latitude: 2.3,
            longitude: 12.5,
            questId: 1,
            code: "given_only_for_owners",
            img: "image_url"
        },
    },
}

const outputFile = './swagger_output.json';
const endpointsFiles = [
    './src/routes/router.ts',
    './src/routes/user.ts',
    './src/routes/location.ts',
    './src/routes/quest.ts',
    './src/routes/scoreboard.ts',
];
swaggerAutogen()(outputFile, endpointsFiles, doc);