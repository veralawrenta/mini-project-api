import { compare, hash } from "bcrypt";

export const hashPassword = async (plainPassword: string) => {
    const salt = 10;
    return await hash(plainPassword, salt);
}
export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
    return await compare(plainPassword, hashedPassword);
}