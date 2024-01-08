import { isValidObjectId } from "mongoose";
import * as yup from "yup";

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
