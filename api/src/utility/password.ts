import argon2 from "argon2"

export async function encryptPassword(password: string) {
    try {
        const hashedPassword: string = await argon2.hash(password);
        return hashedPassword;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function checkPassword(keyClient:string,keySubmit:string):Promise<boolean>{
        return await argon2.verify(keyClient,keySubmit)
}
