import { globSync } from "glob";
import addLog from "./addLog.js";

const fileName = "index.html";

function findHtml(folder) {
    const start = Date.now();
    const pathNormalize = (str) => str.replace(/\\/g, "/");

    let [html] = globSync(`${folder}/**/${fileName}`);
    if (!html) {
        addLog("findHtml", "Файл index.html не найден.");
        return;
    }
    html = pathNormalize(html);
    const end = Date.now();
    const executionTime = end - start;
    addLog("findHtml", "Файл index.html найден.", executionTime);
    return html;
}

export default findHtml;
