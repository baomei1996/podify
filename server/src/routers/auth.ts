import { Router } from "express";

import { validate } from "@/middleware/validator";
import {
    CreateUserSchema,
    EmailVerificationBody,
} from "@/utils/validationSchema";
import { create, verifyEmail } from "@/controllers/user";

const router = Router();

// Create a new user
router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);

export default router;
