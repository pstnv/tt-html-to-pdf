import fs from "fs";

const LOGFILE = "./logs.json";
function addLog(functionName, logText, executionTime = null) {
    let logEntries = [];
    if (fs.existsSync(LOGFILE)) {
        try {
            const content = fs.readFileSync(LOGFILE, "utf8");
            logEntries = content ? JSON.parse(fs.readFileSync(LOGFILE)) : [];
        } catch (error) {
            console.error("Ошибка записи лога", error);
        }
    }
    const logData = {
        functionName,
        timestamp: new Date().toISOString(),
        logText,
        memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
        )}MB`,
        executionTime: `${executionTime}ms`,
    };
    logEntries.push(logData);
    try {
        fs.writeFileSync(LOGFILE, JSON.stringify(logEntries, null, 2));
    } catch (error) {
        console.error("Ошибка записи лога", error);
    }
}

export default addLog;
