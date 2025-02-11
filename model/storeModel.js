import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    imagePath : {
        type: String,
        required: true
    }
}, {timestamps: true});

const Book = mongoose.model("Book", StoreSchema);
export default Book;