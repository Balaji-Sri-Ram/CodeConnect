
export const validatePassword = (pass) => {
    return {
        length: pass.length >= 6 && pass.length <= 12,
        uppercase: /[A-Z]/.test(pass),
        lowercase: /[a-z]/.test(pass),
        number: /[0-9]/.test(pass),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
};

export const isPasswordValid = (pass) => {
    const checks = validatePassword(pass);
    return Object.values(checks).every(Boolean);
};
