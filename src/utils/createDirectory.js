import fs from "fs";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

function createDirectory(path) {
    const start = Date.now();
    if (fs.existsSync(path)) {
        const createTime = countExecutionTime(start);
        addLog(
            "createDirectory",
            `Папка существует. Путь: ${path}`,
            createTime
        );
        return;
    }
    let message = "";
    fs.mkdir(path, { recursive: true }, (err) => {
        message = err
            ? `Error: ${err.message}`
            : `Папка создана. Путь: ${path}`;
        const createTime = countExecutionTime(start);
        addLog("createDirectory", message, createTime);
        if (err) {
            throw err;
        }
    });
}

export default createDirectory;
