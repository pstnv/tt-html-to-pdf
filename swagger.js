import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Convert HTML to PDF",
        description: "Микросервис конвертирования HTML-файлов в PDF",
    },
    host: "localhost:5000",
    basePath: "/",
    consumes: ["application/zip"],
    produces: ["application/pdf"],
};

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/convertRoutes.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);