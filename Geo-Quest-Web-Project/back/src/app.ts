// Patches
import { inject, errorHandler } from "express-custom-error"
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import logger from "./util/logger"

// Instantiate an Express Application
export const app = express()

// Configure Express App Instance
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// TODO: What is that?
// Frontend code access in static mode 
// app.use('/frontend', express.static('./src/frontend'))

// Swagger Documentation
import swaggerUi from "swagger-ui-express";
import swagger from './util/swagger_output.json';
app.use(
    "/doc",
    swaggerUi.serve,
    swaggerUi.setup(swagger)
);

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

// Assign Routes
import router from "./routes/router"
app.use('/', router);
// Handle errors
app.use(errorHandler());
// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})

// Middleware
import { tokenMiddleware } from "./middleware/tokenMiddleware"
app.use(tokenMiddleware);