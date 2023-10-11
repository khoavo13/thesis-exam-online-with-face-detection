import { ReactElement, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import useLoad from "../hooks/useLoad";
import axios from "../api/axios";
import Cookies from "js-cookie";

interface IProtectedRoute {
  children: ReactElement;
  allowedRoles: string[];
}

// function parseJwt(token: string) {
//   var base64Url = token.split(".")[1];
//   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }

export default function ProtectedRoute({
  children,
  allowedRoles,
}: IProtectedRoute) {
  const { auth, setAuth } = useAuth();
  const { showLoading, hideLoading } = useLoad();
  const navigate = useNavigate();

  // console.log("Auth: ", auth);

  const getUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      showLoading!();
      const response = await axios.get(`/api/users/${userId}`);
      hideLoading!();

      if (response.status === 200) {
        setAuth!({
          username: response.data.username,
          roles: response.data.role,
          id: response.data.id,
          userNumber: response.data.userNumber,
          email: response.data.email,
          fullname: response.data.fullName,
        });
      } else {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    } catch (error) {
      hideLoading!();
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    if (!auth) {
      getUser();
    }
  }, [auth]);

  if (Cookies.get("accessToken")) {
    const roles = localStorage.getItem("roles");

    if (roles && allowedRoles.includes(roles)) return children;
    // return <Navigate to="/login" state={{ from: location }} />;
    navigate("/login", { replace: true });
  }
  // navigate("/login", { replace: true });

  return (
    <Navigate
      to="/login"
      // state={{ from: location }}
    />
  );
}
