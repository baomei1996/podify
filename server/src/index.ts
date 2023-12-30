import express from "express";
import "dotenv/config";
import "./db";

const app = express();

const PORT = 8989;

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

/**
 * The plan and features
 * upload audio files
 * listen to single audio
 * add to favorites
 * create playlist
 * remove playlist (public/private)
 * remove audios
 * many more...
 */
