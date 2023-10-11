import { useContext } from "react";
import AppContext from "../context/AppProvider";

type ArrowFunc = () => void;

const useLoad = () => {
  const { showLoading, hideLoading, contextHolder } = useContext(AppContext);
  return { showLoading, hideLoading, contextHolder };
};

export default useLoad;
