import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistByProfile,
} from "@/controllers/playlist";
import { isVerified, mustAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validator";
import {
    NewPlaylistValidationSchema,
    OldPlaylistValidationSchema,
} from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();
router.post(
    "/create",
    mustAuth,
    isVerified,
    validate(NewPlaylistValidationSchema),
    createPlaylist
);

router.patch(
    "/",
    mustAuth,
    validate(OldPlaylistValidationSchema),
    updatePlaylist
);

router.delete("/", mustAuth, deletePlaylist);

router.get("/by-profile", mustAuth, getPlaylistByProfile);

export default router;
