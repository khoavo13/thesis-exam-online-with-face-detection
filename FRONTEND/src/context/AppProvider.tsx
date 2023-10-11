import { FC, ReactNode, createContext, useState } from "react";
import { message, notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";

interface IApp {
  children: ReactNode;
}

interface IAuth {
  username: string;
  id: number;
  userNumber: string;
  roles: string;
  email: string;
  fullname: string;
}

export type AppContextType = {
  auth?: IAuth;
  setAuth?: React.Dispatch<React.SetStateAction<IAuth | undefined>>;
  showLoading?: () => void;
  hideLoading?: () => void;
  contextHolder?: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  openNotification?: (
    placement: NotificationPlacement,
    icon: React.ReactNode,
    message: React.ReactNode,
    description: React.ReactNode,
    duration?: number,
    style?: React.CSSProperties,
    onClose?: () => void
  ) => void;
  notifyHolder?: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
};

const AppContext = createContext<AppContextType>({});

export const AppProvider: FC<IApp> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth>();
  const [loadingMessage, contextHolder] = message.useMessage();
  const [notifyMessage, notifyHolder] = notification.useNotification({
    maxCount: 1,
  });

  const showLoading = () => {
    loadingMessage.open({
      key: "load",
      type: "loading",
      content: "Đang xử lý...",
      duration: 0,
    });
  };

  const hideLoading = () => {
    loadingMessage.destroy("load");
  };

  const openNotification = (
    placement: NotificationPlacement,
    icon: React.ReactNode,
    message: React.ReactNode,
    description: React.ReactNode,
    duration?: number,
    style?: React.CSSProperties,
    onClose?: () => void
  ) => {
    notifyMessage.info({
      icon: icon,
      message: message,
      description: description,
      placement,
      style: style,
      duration: duration ?? 2,
      onClose: onClose,
    });
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        setAuth,
        showLoading,
        hideLoading,
        contextHolder,
        openNotification,
        notifyHolder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
