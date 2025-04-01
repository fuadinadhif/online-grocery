import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  name: string;
  email: string;
  picture: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload | null;
    }
  }
}
