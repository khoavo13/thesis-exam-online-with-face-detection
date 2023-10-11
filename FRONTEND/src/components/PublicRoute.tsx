import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface IPublicRoute {
  children: ReactElement;
}

export default function PublicRoute({ children }: IPublicRoute) {
  return children;
}
