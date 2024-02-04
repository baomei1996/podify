import { createAudio } from "@/controllers/audio";
import { mustAuth } from "@/middleware/auth";
import fileParser from "@/middleware/fileParser";
import { validate } from "@/middleware/validator";
import { AudioValidationSchema } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
    "/crete",
    mustAuth,
    fileParser,
    validate(AudioValidationSchema),
    createAudio
);

export default router;
