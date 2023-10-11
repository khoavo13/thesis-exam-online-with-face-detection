import { useContext } from "react";
import AppContext from "../context/AppProvider";

const useNotification = () => {
  const { notifyHolder, openNotification } = useContext(AppContext);

  return { notifyHolder, openNotification };
};

export default useNotification;
