const getById = (id) => document.getElementById(id);

const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const submitButton = getById("submit");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";

let token, userId;
const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop);
        },
    });

    token = params.token;
    userId = params.userId;

    const res = await fetch("/auth/verify-pass-reset-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ token, userId }),
    });

    if (!res.ok) {
        const { error } = await res.json();
        loader.innerText = error;
        return;
    }

    loader.style.display = "none";
    container.style.display = "block";
});

const displayError = (message) => {
    // first we need to remove if there is any success message.
    success.style.display = "none";
    // set the error message
    error.innerText = message;
    error.style.display = "block";
};

const displaySuccess = (message) => {
    // first we need to remove if there is any error message.
    error.style.display = "none";
    // set the error message
    success.innerText = message;
    success.style.display = "block";
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.value.trim()) {
        //render error message
        return displayError("Password is required.");
    }

    if (!passwordRegex.test(password.value)) {
        // remder error message
        return displayError(
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character!"
        );
    }

    if (password.value !== confirmPassword.value) {
        // render error message
        return displayError("Passwords do not match!");
    }

    console.log("submitting...");

    submitButton.disabled = true;
    submitButton.innerText = "Please wait...";

    // handle the submit
    const res = await fetch("/auth/update-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ token, userId, password: password.value }),
    });

    submitButton.dis = false;
    submitButton.innerText = "Reset password";

    if (!res.ok) {
        const { error } = await res.json();
        return displayError(error);
    }

    displaySuccess("Password updated successfully!");

    // reset the form
    password.value = "";
    confirmPassword.value = "";
};

form.addEventListener("submit", handleSubmit);
