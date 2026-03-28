import crypto from "crypto";

export const decodeSaitResponse = (hexResponse: string): any => {
    // 1. Reverse hex string
    const reversedHex = hexResponse.split("").reverse().join("");

    // 2. Hex → Buffer
    const ciphertext = Buffer.from(reversedHex, "hex");

    // 3. AES-128-CBC — 16-byte key and IV used as raw UTF-8
    const key = Buffer.from("a2jqb2nw5266etzl", "utf8");
    const iv  = Buffer.from("lnous4x06o82jux5", "utf8");

    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    decipher.setAutoPadding(false);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    // 4. PKCS7 unpad
    const unpacked = unpadPkcs7(decrypted);

    // 5. UTF-8 → base64 decode
    const plainStr = unpacked.toString("utf8");
    const jsonStr  = Buffer.from(plainStr, "base64").toString("utf8");

    // 6. Sanitize control chars
    const sanitized = jsonStr.replace(/[\x00-\x1F]/g, "");

    return JSON.parse(sanitized);
}

export const unpadPkcs7 = (data: Buffer): Buffer => {
    const padLen = data[data.length - 1];
    if (padLen > 16 || padLen === 0) return data;
    return data.slice(0, -padLen);
}