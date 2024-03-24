import { CreatePlaylistRequest, UpdatePlaylistRequest } from "@/@types/audio";
import Audio from "@/models/audio";
import Playlist from "@/models/playlist";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

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

export const updatePlaylist: RequestHandler = async (
    req: UpdatePlaylistRequest,
    res
) => {
    const { id, item, title, visibility } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
        { _id: id, owner: req.user.id },
        {
            title,
            visibility,
        },
        { new: true }
    );

    if (!playlist) {
        return res.status(404).json({ error: "could not found the playlist!" });
    }

    if (item) {
        const audio = await Audio.findById(item);
        if (!audio) {
            return res
                .status(404)
                .json({ error: "could not found the audio!" });
        }

        await Playlist.findByIdAndUpdate(playlist._id, {
            $addToSet: { items: item },
        });
    }

    res.json({
        playlist: {
            id: playlist._id,
            title: playlist.title,
            visibility: playlist.visibility,
        },
    });
};

export const deletePlaylist: RequestHandler = async (req, res) => {
    const { playlistId, resId, all } = req.query;

    if (!isValidObjectId(playlistId))
        return res.status(422).json({ error: "Invalid playlist id!" });

    if (all === "yes") {
        const playlist = await Playlist.findOneAndDelete({
            _id: playlistId,
            owner: req.user.id,
        });

        if (!playlist) {
            return res
                .status(404)
                .json({ error: "could not found the playlist!" });
        }
    }

    if (resId) {
        if (!isValidObjectId(resId))
            return res.status(422).json({ error: "Invalid audio id!" });
        const playlist = await Playlist.findOneAndDelete(
            {
                _id: playlistId,
                owner: req.user.id,
            },
            {
                $pull: { items: resId },
            }
        );

        if (!playlist) {
            return res
                .status(404)
                .json({ error: "could not found the playlist!" });
        }
    }
    res.json({ success: true });
};
