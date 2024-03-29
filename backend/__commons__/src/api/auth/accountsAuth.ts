import jwt, { VerifyOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";

const publicKey = fs.readFileSync(
  path.join(findKeyPath(__dirname), "public.key"),
  "utf8"
);

function findKeyPath(currentPath: string): string {
  const keysPath = path.join(currentPath, "keys");
  if (fs.existsSync(keysPath)) return keysPath;
  else return findKeyPath(path.join(currentPath, ".."));
}

const jwtAlgorithm = "RS256";

export type Token = { accountId: number; jwt?: string };

async function verify(token: string) {
  try {
    const decoded: Token = (await jwt.verify(token, publicKey, {
      algorithms: [jwtAlgorithm],
    } as VerifyOptions)) as Token;

    return { accountId: decoded.accountId, jwt: token };
  } catch (error) {
    console.log(`verify: ${error}`);
    return null;
  }
}

export default { verify, findKeyPath };
