import { randomBytes } from "crypto";

export const generateStaffId = () => {
    const randomId = randomBytes(4).toString("hex").toUpperCase();

    return `STF-${randomId}`;
};