import { globSync } from "glob";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

const fileName = "index.html";

function findHtml(folder) {
    const start = Date.now();
    let message = '';
    
    const pathNormalize = (str) => str.replace(/\\/g, "/");

    let [html] = globSync(`${folder}/**/${fileName}`);
    try {
        html = pathNormalize(html);
        message = 'Файл index.html найден';
        return html;      
    } catch (err) {
        message = `Файл index.html не найден`;
    } finally {
        const executionTime = countExecutionTime(start);
        addLog("findHtml", message, executionTime);
    }
}

export default findHtml;
