import { CreatePlaylistRequest } from "@/@types/audio";
import Audio from "@/models/audio";
import Playlist from "@/models/playlist";
import { RequestHandler } from "express";
import { ObjectId, Types } from "mongoose";

export const createPlaylist: RequestHandler = async (
    req: CreatePlaylistRequest,
    res
) => {
    const { title, resId, visibility } = req.body;
    const ownerId = req.user.id;

    // while creating a playlist, we need to check if the resource exists
    // or user just want to create an empty playlist
    // with new playlist name and the audio that user wants to store inside that playlist

    if (resId) {
        const audio = await Audio.findById(resId);
        if (!audio) {
            return res
                .status(404)
                .json({ error: "could not found the audio!" });
        }
    }

    const newPlaylist = new Playlist({
        title,
        owner: ownerId,
        visibility,
    });

    if (resId) newPlaylist.items = [resId as any];
    await newPlaylist.save();

    res.status(200).json({ playlist: newPlaylist });
};
