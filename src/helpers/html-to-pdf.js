import puppeteer from "puppeteer";
import path from "path";
import url from "url";
import addLog from "../utils/addLog.js";
import countExecutionTime from "../utils/countExecutionTime.js";

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
        const pathToUrl = url.pathToFileURL(absolutePath).href;
        page.setJavaScriptEnabled(false);
        await page.goto(pathToUrl, {
            waitUntil: "networkidle0",
        });
        await page.emulateMediaType("screen");
        const pdfBuffer = await page.pdf(options);
        message = "Успешно. Сервер вернул файл после конвертации";
        await page.close();
        return pdfBuffer;
    } catch (err) {
        message = `Ошибка конвертации: ${err.message}`;
    } finally {
        const executionTime = countExecutionTime(start);
        addLog("htmlToPdf", message, executionTime);
    }
}

export default htmlToPdf;
