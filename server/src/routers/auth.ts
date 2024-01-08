import { Router } from "express";

import { validate } from "@/middleware/validator";
import {
    CreateUserSchema,
    TokenAndIDValidation,
    UpdatePasswordSchema,
    SignInValidationSchema,
} from "@/utils/validationSchema";
import {
    create,
    verifyEmail,
    sendReVerificationToken,
    generateForgetPasswordLink,
    grantValid,
    updatePassword,
    signIn,
} from "@/controllers/user";
import { isValidPassResetToken, mustAuth } from "@/middleware/auth";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/variables";
import User from "@/models/user";

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
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, (req, res) => {
    res.json({
        profile: req.user,
    });
});

export default router;
