import "dotenv/config";
import session from "express-session";

const config = {
  app: {
    port: process.env.PORT || 8080,
    env: process.env.PROJECT_ENV,
  },
  db: {
    connection_string: process.env.DATABASE_URL,
  },
  key: {
    secret: process.env.JWT_SECRET_KEY!,
    x_key: process.env.API_KEY,
    refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
    xendit_api_key: process.env.PUBLISHABLE_API_KEY || 'xnd_public_development_P46AfL4jhLD6wMZvfOZJHzKTM9ej8NQvlyHn+Rxg+WLT/7aiDQN1hg==',
  },
  url: {
    local: `http://localhost:${process.env.PORT || 8000}/api/v1`,
    forward: `${process.env.PORT_FORWARD_URL}api/v1`,
  },
  email: {
    address: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
  session: {
    secret: process.env.SESSION_KEY,
    age: parseInt(process.env.SESSION_EXPIRATION || '3600'),
  },
};

export default config;
