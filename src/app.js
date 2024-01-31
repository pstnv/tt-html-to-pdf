import { app, port } from "./expressServer.js";


app.listen(port, () => {
    console.log(`Application listening on port ${port}...`);
});
