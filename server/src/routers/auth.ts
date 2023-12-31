import { Router } from "express";

import { validate } from "@/middleware/validator";
import { CreateUserSchema } from "@/utils/validationSchema";
import { create } from "@/controllers/user";

const router = Router();

// Create a new user
router.post("/create", validate(CreateUserSchema), create);

export default router;
