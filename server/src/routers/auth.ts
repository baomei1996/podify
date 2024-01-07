import { Router } from "express";

import { validate } from "@/middleware/validator";
import {
    CreateUserSchema,
    TokenAndIDValidation,
} from "@/utils/validationSchema";
import {
    create,
    verifyEmail,
    sendReVerificationToken,
    generateForgetPasswordLink,
    isValidPassResetToken,
} from "@/controllers/user";

const router = Router();

// Create a new user
router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
    "/verify-pass-reset-token",
    validate(TokenAndIDValidation),
    isValidPassResetToken
);

export default router;
