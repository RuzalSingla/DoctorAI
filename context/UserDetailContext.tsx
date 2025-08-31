import { createContext } from "react";
import { UsersDetail } from "@/app/provider";

// Define type for context value
type UserDetailContextType = {
  UserDetail: UsersDetail | undefined;
  setUserDetail: React.Dispatch<React.SetStateAction<UsersDetail | undefined>>;
};

// Create context
export const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);
