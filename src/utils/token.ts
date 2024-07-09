import jwt from "jsonwebtoken";
import config from "../config";

class Token {
  static generate(payload: any) {
    const sanitizedPayload = payload;
    const token = jwt.sign(sanitizedPayload, config.key.secret, {
      expiresIn: config.key.expiresIn,
    });

    return token;
  }

  static validate(token: string) {
    const validatedToken = jwt.verify(token, config.key.secret);
    return validatedToken;
  }

  // Utility function to sanitize payload
  // static sanitizePayload(payload: any): any {
  //   if (typeof payload !== "object" || payload === null) {
  //     return payload;
  //   }

  //   if (Array.isArray(payload)) {
  //     return payload.map(Token.sanitizePayload);
  //   }

  //   const sanitizedPayload: any = {};
  //   for (const key in payload) {
  //     if (typeof payload[key] === "bigint") {
  //       sanitizedPayload[key] = payload[key].toString();
  //     } else if (typeof payload[key] === "object") {
  //       sanitizedPayload[key] = Token.sanitizePayload(payload[key]);
  //     } else {
  //       sanitizedPayload[key] = payload[key];
  //     }
  //   }

  //   return sanitizedPayload;
  // }
}

export default Token;