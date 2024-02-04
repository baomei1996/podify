import { RequestWithFile } from "@/middleware/fileParser";
import { categoriesTypes } from "@/utils/audio_category";
import { RequestHandler } from "express";
import formidable from "formidable";
import cloudinary from "@/cloud";
import Audio from "@/models/audio";

interface CreateAudioRequest extends RequestWithFile {
    body: {
        title: string;
        about: string;
        category: categoriesTypes;
    };
}

export const createAudio: RequestHandler = async (
    req: CreateAudioRequest,
    res
) => {
    const { title, about, category } = req.body;
    console.log(req.files);

    const poster = req.files?.poster as formidable.File;
    const audioFile = req.files?.file as formidable.File;
    const ownerId = req.user.id;

    if (!audioFile)
        return res.status(422).json({ error: "Audio file is missing!" });

    const audioRes = await cloudinary.uploader.upload(audioFile.filepath, {
        resource_type: "video",
    });

    const newAudio = new Audio({
        title,
        about,
        category,
        owner: ownerId,
        file: {
            url: audioRes.secure_url,
            publicId: audioRes.public_id,
        },
    });

    if (poster) {
        const audioRes = await cloudinary.uploader.upload(poster.filepath, {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face",
        });

        newAudio.poster = {
            url: poster.filepath,
            publicId: audioRes.public_id,
        };
    }

    await newAudio.save();

    res.status(200).json({ audio: newAudio });
};

export const updateAudio: RequestHandler = async (
    req: CreateAudioRequest,
    res
) => {
    const { title, about, category } = req.body;
    const { audioId } = req.params;
    const poster = req.files?.poster as formidable.File;
    const ownerId = req.user.id;

    const audio = await Audio.findOneAndUpdate(
        { owner: ownerId, _id: audioId },
        {
            title,
            about,
            category,
        },
        { new: true }
    );

    if (!audio) return res.status(404).json({ error: "Audio not found!" });

    if (poster) {
        if (audio.poster?.publicId) {
            await cloudinary.uploader.destroy(audio.poster.publicId);
        }

        const posterRes = await cloudinary.uploader.upload(poster.filepath, {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face",
        });

        audio.poster = {
            url: posterRes.secure_url,
            publicId: posterRes.public_id,
        };

        await audio.save();
    }

    res.status(200).json({ audio });
};
