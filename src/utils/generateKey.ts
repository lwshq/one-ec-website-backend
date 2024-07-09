import crypto from "crypto";
const secretAccKey = crypto.randomBytes(64).toString("base64");
const secretRefKey = crypto.randomBytes(64).toString("base64");
const secretApiKey = crypto.randomBytes(64).toString("base64");

console.log(`Access key : ${secretAccKey}`);
console.log(`Refresh key : ${secretRefKey}`);
console.log(`API key : ${secretRefKey}`);
console.log("Paste these keys in to .env file");