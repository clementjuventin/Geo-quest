// Require Dependencies
import env from "mandatoryenv";

// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
env.load([
    'PORT',
]);
const { PORT } = process.env;
import { app } from "./app";

// Open Server on selected Port
app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
);