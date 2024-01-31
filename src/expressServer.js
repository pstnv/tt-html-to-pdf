import express from "express";
import router from "./routes/convertRoutes.js";
import createDirectory from "./utils/createDirectory.js";

const PORT = 5000;
const DESTINATION_PATH = "./uploads";
const EXTRACT_PATH = "./output";

const app = express();

app.use((req, res, next) => {
    createDirectory(DESTINATION_PATH);
    createDirectory(EXTRACT_PATH);
    next();
});

app.use(express.json());
app.use(router); 

export { app, PORT as port, DESTINATION_PATH, EXTRACT_PATH };
