const enKey = "aa11ss22dd33ff44gg55hh66jj77kk88";
const enIv = "a1s2d3f4g5h6j7k8";

function encryptString(text) {
    const key = CryptoJS.enc.Utf8.parse(enKey); // 32-byte key
    const iv = CryptoJS.enc.Utf8.parse(enIv); // 16-byte IV

    const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
