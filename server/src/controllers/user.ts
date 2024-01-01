import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import { CreateUser } from "@/@types/user";
import User from "@/models/user";
import EmailVerificationToken from "@/models/emailVerificationToken";
import { MAILTRAP_PASS, MAILTRAP_USER } from "@/utils/variables";
import { generateToken } from "@/utils/helper";

export const create: RequestHandler = async (req: CreateUser, res) => {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name });

    // send verification email
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASS,
        },
    });

    // token = 6 digit otp => 123456 => send
    // token = attach these tokens to the <a href="your_url/token=123456" /> => verify
    const token = generateToken();
    await EmailVerificationToken.create({
        owner: user._id,
        token,
    });

    transport.sendMail({
        to: user.email,
        from: "auth@myapp.com",
        html: `<h1>Your verification token is ${token}.</h1>`,
    });

    res.status(201).json({ user });
};
