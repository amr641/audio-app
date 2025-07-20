import fs from "fs"
import path from "path";
import { log } from "console";
export let removeUnHandledFiles = async function (req) {
    fs.promises.unlink(path.resolve(`./uploads/audio/user_${req.user.userId}`, req.file.filename))
        .then(() => { log("file deleted") })
        .catch(err => {
            log("cannot delete the file", err);
        })
}