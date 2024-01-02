import nodemailer from "nodemailer";
import path from "path";

import {
    MAILTRAP_PASS,
    MAILTRAP_USER,
    VERIFICATION_EMAIL,
} from "@/utils/variables";
import { generateTemplate } from "@/mail/template";

const generateTransporter = () => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: MAILTRAP_USER,
            pass: MAILTRAP_PASS,
        },
    });

    return transport;
};

interface Profile {
    name: string;
    email: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
    const transport = generateTransporter();
    const { name, email } = profile;

    const welcomeMessage = `Hi ${name}, welcome to Podify! There are so mush thing that we do for verified users. Use the given OTP to verify your email.`;

    transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
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
};
