import { Router } from "express";

import { validate } from "@/middleware/validator";
import {
    CreateUserSchema,
    EmailVerificationBody,
} from "@/utils/validationSchema";
import {
    create,
    verifyEmail,
    sendReVerificationToken,
    generateForgetPasswordLink,
} from "@/controllers/user";

const router = Router();

// Create a new user
router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);

export default router;
