import { Router } from "express";

import { validate } from "@/middleware/validator";
import {
    CreateUserSchema,
    TokenAndIDValidation,
    UpdatePasswordSchema,
} from "@/utils/validationSchema";
import {
    create,
    verifyEmail,
    sendReVerificationToken,
    generateForgetPasswordLink,
    grantValid,
    updatePassword,
} from "@/controllers/user";
import { isValidPassResetToken } from "@/middleware/auth";

const router = Router();

// Create a new user
router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
    "/verify-pass-reset-token",
    validate(TokenAndIDValidation),
    isValidPassResetToken,
    grantValid
);
router.post(
    "/update-password",
    validate(UpdatePasswordSchema),
    isValidPassResetToken,
    updatePassword
);

export default router;
