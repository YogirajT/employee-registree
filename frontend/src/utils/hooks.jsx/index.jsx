import { UserRole } from "@employee-registree/config";
import { useStore } from "react-redux";

export const useAuth = () => {
  const access = useStore();

  const state = access.getState();
  const user = state?.access?.user;

  const isAuthenticated = user?.isAuthenticated;

  const role = isAuthenticated ? state?.access?.user?.decoded?.role : null;

  return { isAuthenticated, role };
};

export const useRole = () => {
  const access = useStore();

  const isSuperUser =
    access.getState()?.access?.user?.decoded?.role === UserRole.SUPER;
  const isAdminUser =
    access.getState()?.access?.user?.decoded?.role === UserRole.ADMIN;

  return { isSuperUser, isAdminUser };
};
