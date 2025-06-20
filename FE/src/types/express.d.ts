import { JwtPayload } from "../middlewares/authorization";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export { JwtPayload };
