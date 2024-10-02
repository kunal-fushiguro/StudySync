import jwt from "jsonwebtoken";
import { JWT_SECERT_TOKEN } from "./env";

async function generateToken(id: string) {
  const token = await jwt.sign({ id: id }, String(JWT_SECERT_TOKEN), {
    expiresIn: "7d",
  });
  return token;
}

async function checkValidation(token: string) {
  const isValid = await jwt.verify(token, String(JWT_SECERT_TOKEN));
  return isValid;
}

export { generateToken, checkValidation };
