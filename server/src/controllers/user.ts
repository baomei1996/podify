import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import path from "path";

import { CreateUser } from "@/@types/user";
import User from "@/models/user";
import EmailVerificationToken from "@/models/emailVerificationToken";
import { MAILTRAP_PASS, MAILTRAP_USER } from "@/utils/variables";
import { generateToken } from "@/utils/helper";
import { generateTemplate } from "@/mail/template";

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

    const welcomeMessage = `Hi ${user.name}, welcome to Podify! There are so mush thing that we do for verified users. Use the given OTP to verify your email.`;

    transport.sendMail({
        to: user.email,
        from: "auth@myapp.com",
        subject: "Welcome to Podify",
        html: generateTemplate({
            title: "Welcome to Podify",
            message: welcomeMessage,
            logo: "cid:logo",
            banner: "cid:welcome",
            link: "#",
            btnTitle: token,
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/assets/logo.png"),
                cid: "logo",
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/assets/welcome.png"),
                cid: "welcome",
            },
        ],
    });

    res.status(201).json({ user });
};
