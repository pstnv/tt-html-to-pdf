import fs from "fs";

function createFile(path) {
    if (fs.existsSync(path)) {
        return;
    }
    fs.writeFile(path, '', (err) => {
        if (err) {
            throw err;
        }
    });
}

export default createFile;
