import bcryptjs from "bcryptjs";

async function hashThePassword(password: string) {
  const newPass = await bcryptjs.hash(password, 12);
  return newPass;
}

async function compareThePassword(password: string, hashedPassword: string) {
  const isCorrect = await bcryptjs.compare(password, hashedPassword);
  return isCorrect;
}

export { hashThePassword, compareThePassword };
