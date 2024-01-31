import multer from "multer";
import path from "path";
import fs from "fs";
import extractFiles from "../utils/extractFiles.js";
import htmlToPdf from "../helpers/html-to-pdf.js";
import findHtml from "../utils/findHtml.js";
import addLog from "../utils/addLog.js";
import { DESTINATION_PATH, EXTRACT_PATH } from "../expressServer.js";

const GIGABYTE = Math.pow(1024, 3);
const MAX_SIZE = 2 * GIGABYTE;
const FILE_TYPE = "zip";

export const handleConversion = async (req, res, next) => {
    const convertStart = Date.now();
    const upload = multer({
        storage: multer.diskStorage({
            destination: DESTINATION_PATH,
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            },
        }),
        limits: {
            fileSize: MAX_SIZE,
        },
        fileFilter(req, file, cb) {
            const startfileFilter = Date.now();
            const extension =
                path.extname(file.originalname) === `.${FILE_TYPE}`;
            if (extension) {
                let endfileFilter = Date.now();
                addLog(
                    "fileFilter",
                    "Расширение соответствует.",
                    endfileFilter - startfileFilter
                );
                return cb(null, true);
            } else {
                let endfileFilter = Date.now();
                const message = `Загрузите файл с раширением .${FILE_TYPE}.`;
                addLog("fileFilter", message, endfileFilter - startfileFilter);
                cb(
                    {
                        name: "FILE_TYPE",
                        message,
                    },
                    false
                );
            }
        },
    }).single("file");

    upload(req, res, async function (err) {
        const startupload = Date.now();
        if (err?.code === "LIMIT_FILE_SIZE") {
            err.message = `Размер файла должен быть менее ${
                MAX_SIZE / GIGABYTE
            }Гб.`;
        }
        if (err) {
            let endupload = Date.now();
            addLog("upload", err.message, endupload - startupload);
            // console.log(err.message);
            return res.status(403).send(err.message);
        }
        const zipArch = req.file;
        if (!zipArch) {
            // console.log(`Загрузите архив.`);
            addLog("zipArch", "400 Error. Загрузите архив.");
            return res.status(400).send("Загрузите архив.");
        } else {
            let endupload = Date.now();
            addLog(
                "upload",
                `Архив загружен в папку ${DESTINATION_PATH}`,
                endupload - startupload
            );
        }
        const zipPath = zipArch.path;
        const extractedFilesFolder = extractFiles(zipPath, EXTRACT_PATH);
        if (!extractedFilesFolder) {
            addLog("extractedFilesFolder", "Файлы не найдены.");
            return;
        }
        const html = findHtml(extractedFilesFolder);
        if (!html) {
            addLog("html", "Архив должен содержать файл index.html.");
            // console.log("Архив должен содержать файл index.html.");
            return res
                .status(400)
                .send("Архив должен содержать файл index.html.");
        }
        const pdf = await htmlToPdf(html);
        if (!pdf) {
            addLog("pdf", "Что-то пошло не так...");
            return res.status(400).send("Что-то пошло не так...");
        }
        const pdfName = path.parse(zipArch.originalname).name + ".pdf";
        fs.writeFileSync(`${EXTRACT_PATH}/${pdfName}`, pdf);

        res.contentType("application/pdf");
        res.status(200).send(pdf);
        const convertEnd = Date.now();
        const finalExecutionTime = convertEnd - convertStart;
        addLog(
            "handleConversion",
            "Конвертация завершена успешно",
            finalExecutionTime
        );
    });
};
