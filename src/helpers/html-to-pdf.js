import puppeteer from "puppeteer";
import path from "path";
import addLog from "../utils/addLog.js";

const defaultOptions = {
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
};

async function htmlToPdf(html, options = defaultOptions) {
    const start = Date.now();
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
        const end = Date.now();
        const executionTime = end - start;
        addLog(
            "htmlToPdf",
            "Успешно. Сервер вернул файл после конвертации.",
            executionTime
        );
        return pdfBuffer;
    } catch (err) {
        addLog(
            "htmlToPdf",
            `Ошибка конвертации: ${err.message}.  `,
            executionTime
        );
    }
}

export default htmlToPdf;
