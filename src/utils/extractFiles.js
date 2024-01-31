import AdmZip from "adm-zip";
import path from "path";
import createDirectory from "./createDirectory.js";
import addLog from "./addLog.js";

function extractFiles(zipPath, outputPath) {
    if (!zipPath) {
        addLog("extractFiles", "Путь не найден.");
        return;
    }
    const pathObj = path.parse(zipPath);
    if (!outputPath) {
        outputPath = pathObj.dir;
    }
    const outputFolder = `${outputPath}/${pathObj.name}`;

    try {
        const start = Date.now();
        const zip = new AdmZip(zipPath);
        createDirectory(outputFolder);
        zip.extractAllTo(outputFolder, true);
        const end = Date.now();
        const executionTime = end - start;
        addLog("extractFiles", "Файлы извлечены успешно.", executionTime);
        return outputFolder;
    } catch (err) {
        addLog("extractFiles", `Error: ${err}`);
        // console.log(`Error: ${err}`);
    }
}

export default extractFiles;
