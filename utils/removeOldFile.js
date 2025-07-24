import fs from "fs"
import path from "path";
import { log } from "console";
export let removeUnHandledFiles = async function (fileData) {
    fs.promises.unlink(path.resolve(`./uploads/audio/user_${fileData.userId}`, fileData.filename))
        .then(() => { log("file deleted") })
        .catch(err => {
            log("cannot delete the file", err);
        })
}