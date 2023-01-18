import { UserRole } from "@employee-registree/config";
import { ObjectId } from "mongodb";
import { UnauthorizedError } from "../../presentation/errors";

export const adminAuthMiddleware =
  () => async (context: any, next: () => void) => {
    const { user } = context.req as unknown as {
      user: { _id: ObjectId; role: UserRole };
    };

    if (![UserRole.ADMIN, UserRole.SUPER].includes(user.role)) {
      throw new UnauthorizedError(
        " You are not allowed to access this resource"
      );
    }
    await next();
  };

export const authMiddleware = () => async (context: any, next: () => void) => {
  const { user } = context.req as unknown as {
    user: { _id: ObjectId; role: UserRole };
  };
  if (!user) {
    throw new UnauthorizedError("You are not allowed to access this resource");
  }
  await next();
};
