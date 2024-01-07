import { RequestHandler } from "express";

import { CreateUser, VerifyEmailRequest } from "@/@types/user";
import User from "@/models/user";
import { generateToken } from "@/utils/helper";
import {
    sendForgetPasswordMail,
    sendPassResetSuccessEmail,
    sendVerificationMail,
} from "@/utils/mail";
import EmailVerificationToken from "@/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import PasswordResetToken from "@/models/passwordResetToken";
import { PASSWORD_RESET_LINK } from "@/utils/variables";

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

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: "Account not found!" });

    // generate the link
    // https://yourapp.com/reset-password?token={token}&userId={userId}

    await PasswordResetToken.findOneAndDelete({
        owner: user._id,
    });

    const token = crypto.randomBytes(36).toString("hex");

    await PasswordResetToken.create({
        owner: user._id,
        token,
    });

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
    sendForgetPasswordMail({ email: user.email, link: resetLink });

    res.json({ message: "Check your register mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
    res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
    const { password, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(403).json({ message: "Unauthorized access!" });
    }

    const matched = await user.comparePassword(password);
    if (matched) {
        return res
            .status(422)
            .json({ message: "New password must be different!" });
    }

    user.password = password;
    await user.save();

    await PasswordResetToken.findOneAndDelete({ owner: user._id });

    // send the success email
    sendPassResetSuccessEmail({ name: user.name, email: user.email });
    res.json({ message: "Password updated successfully!" });
};
