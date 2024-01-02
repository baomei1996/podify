import { RequestHandler } from "express";

import { CreateUser, VerifyEmailRequest } from "@/@types/user";
import User from "@/models/user";
import { generateToken } from "@/utils/helper";
import { sendVerificationMail } from "@/utils/mail";
import EmailVerificationToken from "@/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";

export const create: RequestHandler = async (req: CreateUser, res) => {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name });

    // send verification email
    const token = generateToken();
    await EmailVerificationToken.create({
        owner: user._id,
        token,
    });
    sendVerificationMail(token, { name, email });
    res.status(201).json({ user });
};

export const verifyEmail: RequestHandler = async (
    req: VerifyEmailRequest,
    res
) => {
    const { token, userId } = req.body;
    const verificationToken = await EmailVerificationToken.findOne({
        owner: userId,
    });

    if (!verificationToken) {
        return res.status(403).json({ message: "Invalid token" });
    }

    const matched = await verificationToken.compareToken(token);
    if (!matched) {
        return res.status(403).json({ message: "Invalid token" });
    }

    // 정상적인 토큰일 경우 verified를 true로 업데이트
    await User.findByIdAndUpdate(userId, { verified: true });
    // 토큰 삭제
    await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

    res.status(200).json({ message: "your email is verified" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
        return res.status(403).json({ message: "Invalid request!" });
    }

    // delete existing token
    await EmailVerificationToken.findOneAndDelete({ owner: userId });

    // re-generate token
    const token = generateToken();
    await EmailVerificationToken.create({
        owner: userId,
        token,
    });

    const user = await User.findById(userId);
    if (!user) {
        return res.status(403).json({ message: "Invalid request!" });
    }

    // send verification email
    sendVerificationMail(token, {
        name: user.name,
        email: user.email,
    });

    res.json({ message: "Please check your mail!" });
};
