import { useSession } from "next-auth/react";
import React, { FC } from "react";
import LoginForm from "./LoginForm";

interface AuthCheckProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
}

const AuthCheck: FC<AuthCheckProps> = ({ children, fallback }) => {
  const { data: session } = useSession();
  if (session) return children;
  return fallback || <LoginForm />;
};

export default AuthCheck;
