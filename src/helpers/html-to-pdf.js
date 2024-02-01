import puppeteer from "puppeteer";
import path from "path";
import addLog from "../utils/addLog.js";
import countExecutionTime from "../utils/countExecutionTime.js";
import findHtml from "../utils/findHtml.js";

const defaultOptions = {
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
};

async function htmlToPdf(html, options = defaultOptions) {
    const start = Date.now();
    let message = "";
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        const absolutePath = path.resolve(html).replace(/\\/g, "/");
        page.setJavaScriptEnabled(false);
        await page.goto(absolutePath, {
            waitUntil: "networkidle0",
        });
        await page.emulateMediaType("screen");
        const pdfBuffer = await page.pdf(options);
        message = "Успешно. Сервер вернул файл после конвертации.";
        return pdfBuffer;
    } catch (err) {
        message = `Ошибка конвертации: ${err.message}.  `;
    } finally {
        const executionTime = countExecutionTime(start);
        addLog("htmlToPdf", message, executionTime);
    }
}

export default htmlToPdf;