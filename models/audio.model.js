import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
        trim: true,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    audioFile: {
        type: String,
        required: [true, "Audio file is required"],
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "AddedBy is required"],
    },
});
const Audio = mongoose.model("Audio", audioSchema);
export default Audio;