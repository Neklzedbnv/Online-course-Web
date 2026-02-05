export const jwtConfig = {
  secret: process.env.JWT_SECRET || "jwt_secret_key",
  expiresIn: "7d",
};