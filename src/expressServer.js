import express from "express";
import router from "./routes/convertRoutes.js";
import swaggerUi from 'swagger-ui-express';
import createDirectory from "./utils/createDirectory.js";
import createFile from "./utils/createFile.js";

/* 
when use this:
import swaggerFile from "./../swagger-output.json" assert { type: "json" };
get:
(node: 6456) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
*/

// solution
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const swaggerFile = require("./../swagger-output.json"); // use the require method

const PORT = 5000;
const DESTINATION_PATH = "./uploads";
const EXTRACT_PATH = "./output";
const LOGFILE = "./logs.json";

const app = express();

app.use((req, res, next) => {
    createFile(LOGFILE);
    createDirectory(DESTINATION_PATH);
    createDirectory(EXTRACT_PATH);
    next();
});

app.use(express.json());
app.use(router /* #swagger.tags = ['Convert'] */); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

export { app, PORT as port, DESTINATION_PATH, EXTRACT_PATH };
