import fs from "fs";
import addLog from "./addLog.js";

function createDirectory(path) {
    if (fs.existsSync(path)) {
        addLog("createDirectory", `Папка существует. Путь: ${path}.`);
        return;
    }
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            addLog("createDirectory", `Error: ${err.message}, ${err.code}`);
            // console.log(err);
        } else {
            addLog("createDirectory", `Папка создана. Путь: ${path}.`);
        }
    });
}

export default createDirectory;
