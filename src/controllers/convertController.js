import multer from "multer";
import path from "path";
import fs from "fs";
import extractFiles from "../utils/extractFiles.js";
import htmlToPdf from "../helpers/html-to-pdf.js";
import findHtml from "../utils/findHtml.js";
import addLog from "../utils/addLog.js";
import countExecutionTime from "../utils/countExecutionTime.js";
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
                const filteringTime = countExecutionTime(startfileFilter);
                addLog(
                    "fileFilter",
                    "Расширение соответствует",
                    filteringTime
                );
                return cb(null, true);
            } else {
                const filteringTime = countExecutionTime(startfileFilter);
                const message = `Загрузите файл с раширением .${FILE_TYPE}`;
                addLog("fileFilter", message, filteringTime);
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
        const startUpload = Date.now();
        if (err?.code === "LIMIT_FILE_SIZE") {
            err.message = `Размер файла должен быть менее ${
                MAX_SIZE / GIGABYTE
            }Гб.`;
        }
        if (err) {
            const uploadingTime = countExecutionTime(startUpload);
            addLog("upload", err.message, uploadingTime);
            return res.status(403).send(err.message);
        }
        const zipArch = req.file;
        if (!zipArch) {
            const uploadingTime = countExecutionTime(startUpload);
            addLog("upload", "400 Error. Загрузите архив", uploadingTime);
            return res.status(400).send("Загрузите архив");
        } else {
            const uploadingTime = countExecutionTime(startUpload);
            addLog(
                "upload",
                `Архив загружен в папку ${DESTINATION_PATH}`,
                uploadingTime
            );
        }
        const zipPath = zipArch.path;
        const extractedFilesFolder = extractFiles(zipPath, EXTRACT_PATH);
        if (!extractedFilesFolder) {
            addLog("upload", "Файлы не найдены");
            return;
        }
        const html = findHtml(extractedFilesFolder);
        if (!html) {
            const convertStop = countExecutionTime(convertStart);
            addLog(
                "upload",
                "Архив должен содержать файл index.html",
                convertStop
            );
            return res
                .status(400)
                .send("Архив должен содержать файл index.html");
        }
        const pdf = await htmlToPdf(html);
        if (!pdf) {
            const convertStop = countExecutionTime(convertStart);
            addLog("handleConversion", "Что-то пошло не так...", convertStop);
            return res.status(400).send("Что-то пошло не так...");
        }
        const pdfName = path.parse(zipArch.originalname).name + ".pdf";
        fs.writeFileSync(`${EXTRACT_PATH}/${pdfName}`, pdf);

        res.contentType("application/pdf");
        res.status(200).send(pdf);

        const finalExecutionTime = countExecutionTime(convertStart);
        addLog(
            "handleConversion",
            "Конвертация завершена успешно",
            finalExecutionTime
        );
    });
};
