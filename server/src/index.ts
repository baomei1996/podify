import express from "express";
import "dotenv/config";
import "./db";

import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favoriteRouter from "./routers/favorite";
import playlistRouter from "./routers/playlist";

const app = express();

// register middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);

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
