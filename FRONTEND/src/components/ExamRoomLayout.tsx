import { Button, Layout, MenuTheme, Switch, Tabs, Tooltip, theme } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

interface IExamRoom {
  children: React.ReactNode;
}

export default function ExamRoomLayout({ children }: IExamRoom) {
  const [pageTheme, setPageTheme] = useState<MenuTheme>("light");
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const changeTheme = (value: boolean) => {
    setPageTheme(value ? "light" : "dark");
  };

  const logout = async () => {
    setAuth!(undefined);
    localStorage.clear();
    navigate("/login");
  };

  const goToHomePage = () => {
    const path = auth?.roles === "STUDENT" ? "/" : "/teacher";
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex", // Sử dụng flexbox để căn chỉnh các phần tử trong header
          justifyContent: "space-between", // Các phần tử trong header sẽ nằm ở hai bên cùng của header
          alignItems: "center", // Căn chỉnh các phần tử dọc theo trục chính của header
        }}
      >
        <div
          style={{
            marginLeft: "24px",
          }}
        >
          <Button type="text" onClick={goToHomePage} icon={<HomeOutlined />}>
            Trang chủ
          </Button>
        </div>
        <div
          style={{
            marginRight: "24px",
          }}
        >
          <Button
            type="text"
            icon={<UserOutlined />}
            style={{
              marginRight: "12px",
              backgroundColor: "rgb(240, 242, 245)",
            }}
          >
            {auth?.fullname}
          </Button>
          <Tooltip placement="bottom" title="Đăng xuất">
            <Button onClick={logout} type="text" icon={<LogoutOutlined />} />
          </Tooltip>
        </div>
      </Header>
      <Layout style={{ padding: "24px 24px" }}>
        <Content style={{ background: colorBgContainer }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
