// GET /api/admin/audios
import Audio from "../models/audio.model.js";
import { AppError } from "../utils/customErr.js"
const getAllUsersAudios = async (req, res) => {
    try {

        let audios = await Audio.find();
        if (!audios.length) throw new AppError("No Audios Found", 404);
        res.status(200).json({ success: true, audios })
    } catch (error) {
        throw error
    }
}
// DELETE /api/admin/audio/:id 

const deleteAudioForAdmin = async (req, res) => {
    try {

        let { id } = req.params;
        if (!id) throw new AppError("id is required", 400);
        let audio = await Audio.findById(id);
        if (!audio) throw new AppError("Audio Not Found", 404);
        await audio.deleteOne()
        res.status(200).json({ success: true, message: "audio deleted successfuly" })
    } catch (error) {
        throw error
    }


}
export { getAllUsersAudios, deleteAudioForAdmin }