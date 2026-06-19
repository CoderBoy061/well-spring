import jwt from "jsonwebtoken";

interface TokenPayload {
  creatorId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
};
