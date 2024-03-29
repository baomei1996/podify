import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { categories } from "./audio_category";

export const CreateUserSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name is missing!")
        .min(3, "Name is too short!")
        .max(20, "Name is too long!"),
    email: yup
        .string()
        .required("Email is missing!")
        .email("Email is invalid!"),
    password: yup
        .string()
        .trim()
        .required("Password is missing!")
        .min(8, "Password is too short!")
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character!"
        ),
});

export const TokenAndIDValidation = yup.object().shape({
    token: yup.string().trim().required("Invalid token!"),
    userId: yup
        .string()
        .trim()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            } else {
                return "";
            }
        })
        .required("Invalid userId!"),
});

export const UpdatePasswordSchema = yup.object().shape({
    token: yup.string().trim().required("Invalid token!"),
    userId: yup
        .string()
        .trim()
        .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
                return value;
            } else {
                return "";
            }
        })
        .required("Invalid userId!"),
    password: yup
        .string()
        .trim()
        .required("Password is missing!")
        .min(8, "Password is too short!")
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character!"
        ),
});

export const SignInValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is missing!")
        .email("Email is invalid!"),
    password: yup.string().trim().required("Password is missing!"),
});

export const AudioValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    about: yup.string().required("About is missing!"),
    category: yup
        .string()
        .oneOf(categories, "Invalid category!")
        .required("Category is missing!"),
});

export const NewPlaylistValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    resId: yup.string().transform(function (value) {
        this.isType(value) && isValidObjectId(value) ? value : "";
    }),
    visibility: yup
        .string()
        .oneOf(["public", "private", "auto"], "Invalid visibility!")
        .required("Visibility is missing!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    // this is going to validate the audio id
    item: yup.string().transform(function (value) {
        return this.isType(value) && isValidObjectId(value) ? value : "";
    }),
    // this is going to validate the playlist id
    id: yup.string().transform(function (value) {
        return this.isType(value) && isValidObjectId(value) ? value : "";
    }),
    visibility: yup
        .string()
        .oneOf(["public", "private", "auto"], "Invalid visibility!"),
});
