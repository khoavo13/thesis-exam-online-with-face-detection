import { useContext } from "react";
import AppContext from "../context/AppProvider";

const useAuth = () => {
  const { auth, setAuth } = useContext(AppContext);
  return { auth, setAuth };
};

export default useAuth;
